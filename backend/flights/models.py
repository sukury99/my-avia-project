from django.contrib.auth.models import User
from django.db import models


class Airplane(models.Model):
    name = models.CharField(max_length=200, verbose_name='Название')
    image = models.ImageField(upload_to='airplanes/', verbose_name='Фото')
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Цена за час')
    description = models.TextField(verbose_name='Описание')
    fleet_page = models.PositiveSmallIntegerField(default=1, verbose_name='Страница флота')

    class Meta:
        verbose_name = 'Самолёт'
        verbose_name_plural = 'Самолёты'

    def __str__(self):
        return self.name


class AuthToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='auth_tokens')
    key = models.CharField(max_length=40, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Token for {self.user.username}'


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    airplane = models.ForeignKey(Airplane, on_delete=models.CASCADE, related_name='bookings')
    departure_date = models.DateField(verbose_name='Дата вылета')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирования'
        ordering = ['-departure_date']

    def __str__(self):
        return f'{self.user.username} — {self.airplane.name} ({self.departure_date})'
