from datetime import date
from decimal import Decimal

from ninja import Schema


class RegisterSchema(Schema):
    username: str
    password: str
    email: str = ''


class LoginSchema(Schema):
    username: str
    password: str


class UserSchema(Schema):
    id: int
    username: str
    is_staff: bool
    token: str = ''


class AirplaneSchema(Schema):
    id: int
    name: str
    image: str
    price: Decimal
    description: str


class BookingCreateSchema(Schema):
    airplane_id: int
    departure_date: date


class BookingUpdateSchema(Schema):
    airplane_id: int
    departure_date: date


class BookingSchema(Schema):
    id: int
    airplane: AirplaneSchema
    departure_date: date
    created_at: str


class AdminBookingSchema(Schema):
    id: int
    user: UserSchema
    airplane: AirplaneSchema
    departure_date: date
    created_at: str


class MessageSchema(Schema):
    message: str
