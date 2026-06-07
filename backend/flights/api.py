from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from ninja import NinjaAPI

from .auth import bearer_auth, create_token
from .models import Airplane, AuthToken, Booking
from .schemas import (
    AdminBookingSchema,
    AirplaneSchema,
    BookingCreateSchema,
    BookingSchema,
    BookingUpdateSchema,
    LoginSchema,
    MessageSchema,
    RegisterSchema,
    UserSchema,
)

api = NinjaAPI(title='JetBook API', csrf=False)


def _user_schema(user: User) -> UserSchema:
    return UserSchema(id=user.id, username=user.username, is_staff=user.is_staff)


def _airplane_schema(airplane: Airplane, request: HttpRequest) -> AirplaneSchema:
    image_url = request.build_absolute_uri(airplane.image.url) if airplane.image else ''
    return AirplaneSchema(
        id=airplane.id,
        name=airplane.name,
        image=image_url,
        price=airplane.price,
        description=airplane.description,
    )


def _booking_schema(booking: Booking, request: HttpRequest) -> BookingSchema:
    return BookingSchema(
        id=booking.id,
        airplane=_airplane_schema(booking.airplane, request),
        departure_date=booking.departure_date,
        created_at=booking.created_at.isoformat(),
    )


def _admin_booking_schema(booking: Booking, request: HttpRequest) -> AdminBookingSchema:
    return AdminBookingSchema(
        id=booking.id,
        user=_user_schema(booking.user),
        airplane=_airplane_schema(booking.airplane, request),
        departure_date=booking.departure_date,
        created_at=booking.created_at.isoformat(),
    )


@api.post('/auth/register', response={201: UserSchema, 400: MessageSchema})
def register(request: HttpRequest, payload: RegisterSchema):
    if User.objects.filter(username=payload.username).exists():
        return 400, {'message': 'Пользователь с таким именем уже существует'}
    user = User.objects.create_user(
        username=payload.username,
        password=payload.password,
        email=payload.email,
    )
    token = create_token(user)
    return 201, UserSchema(
        id=user.id, username=user.username, is_staff=user.is_staff, token=token,
    )


@api.post('/auth/login', response={200: UserSchema, 401: MessageSchema})
def auth_login(request: HttpRequest, payload: LoginSchema):
    user = authenticate(request, username=payload.username, password=payload.password)
    if user is None:
        return 401, {'message': 'Неверное имя пользователя или пароль'}
    token = create_token(user)
    return 200, UserSchema(
        id=user.id, username=user.username, is_staff=user.is_staff, token=token,
    )


@api.post('/auth/logout', auth=bearer_auth, response=MessageSchema)
def auth_logout(request: HttpRequest):
    AuthToken.objects.filter(user=request.auth).delete()
    return {'message': 'Вы вышли из системы'}


@api.get('/auth/me', auth=bearer_auth, response=UserSchema)
def auth_me(request: HttpRequest):
    user = request.auth
    return _user_schema(user)


@api.get('/airplanes', response=list[AirplaneSchema])
def list_airplanes(request: HttpRequest, fleet: int | None = None):
    qs = Airplane.objects.all().order_by('id')
    if fleet is not None:
        qs = qs.filter(fleet_page=fleet)
    return [_airplane_schema(a, request) for a in qs]


@api.post('/bookings', auth=bearer_auth, response={201: BookingSchema, 400: MessageSchema})
def create_booking(request: HttpRequest, payload: BookingCreateSchema):
    airplane = get_object_or_404(Airplane, id=payload.airplane_id)
    booking = Booking.objects.create(
        user=request.auth,
        airplane=airplane,
        departure_date=payload.departure_date,
    )
    return 201, _booking_schema(booking, request)


@api.get('/bookings/my', auth=bearer_auth, response=list[BookingSchema])
def my_bookings(request: HttpRequest):
    bookings = Booking.objects.filter(user=request.auth).select_related('airplane')
    return [_booking_schema(b, request) for b in bookings]


@api.get('/bookings/all', auth=bearer_auth, response={200: list[AdminBookingSchema], 403: MessageSchema})
def all_bookings(request: HttpRequest):
    if not request.auth.is_staff:
        return 403, {'message': 'Доступ только для администраторов'}
    bookings = Booking.objects.select_related('user', 'airplane').all()
    return [_admin_booking_schema(b, request) for b in bookings]


def _require_staff(request: HttpRequest):
    if not request.auth.is_staff:
        return False
    return True


@api.put('/bookings/{booking_id}', auth=bearer_auth, response={200: AdminBookingSchema, 403: MessageSchema, 404: MessageSchema})
def update_booking(request: HttpRequest, booking_id: int, payload: BookingUpdateSchema):
    if not _require_staff(request):
        return 403, {'message': 'Доступ только для администраторов'}
    booking = get_object_or_404(Booking, id=booking_id)
    airplane = get_object_or_404(Airplane, id=payload.airplane_id)
    booking.airplane = airplane
    booking.departure_date = payload.departure_date
    booking.save()
    return _admin_booking_schema(booking, request)


@api.delete('/bookings/{booking_id}', auth=bearer_auth, response={200: MessageSchema, 403: MessageSchema, 404: MessageSchema})
def delete_booking(request: HttpRequest, booking_id: int):
    if not _require_staff(request):
        return 403, {'message': 'Доступ только для администраторов'}
    booking = get_object_or_404(Booking, id=booking_id)
    booking.delete()
    return {'message': 'Бронирование удалено'}
