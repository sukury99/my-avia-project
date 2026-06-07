from django.contrib import admin

from .models import Airplane, AuthToken, Booking


@admin.register(Airplane)
class AirplaneAdmin(admin.ModelAdmin):
    list_display = ('name', 'price')


@admin.register(AuthToken)
class AuthTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'key', 'created_at')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'airplane', 'departure_date', 'created_at')
    list_filter = ('departure_date',)
