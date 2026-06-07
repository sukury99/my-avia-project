# JetBook — бронирование частных самолётов

Веб-приложение для бронирования частных бизнес-джетов.

**Стек:** React + Django Ninja + PostgreSQL + Docker

## Быстрый старт

```bash
docker compose up --build
```

После запуска:

| Сервис   | URL                        |
|----------|----------------------------|
| Фронтенд | http://localhost:5173      |
| Бэкенд   | http://localhost:8000/api  |
| Django Admin | http://localhost:8000/admin |

## Тестовые аккаунты

| Роль            | Логин | Пароль   |
|-----------------|-------|----------|
| Админ           | admin | admin123 |
| Пользователь    | user  | user123  |

## API эндпоинты

| Метод | Путь              | Описание                    | Авторизация |
|-------|-------------------|-----------------------------|-------------|
| POST  | /api/auth/register | Регистрация                | —           |
| POST  | /api/auth/login    | Вход                       | —           |
| POST  | /api/auth/logout   | Выход                      | ✓           |
| GET   | /api/auth/me       | Текущий пользователь       | ✓           |
| GET   | /api/airplanes     | Список самолётов           | —           |
| POST  | /api/bookings      | Создать бронирование       | ✓           |
| GET   | /api/bookings/my   | Мои бронирования           | ✓           |
| GET   | /api/bookings/all  | Все бронирования (админ)   | ✓ staff     |
| PUT   | /api/bookings/{id} | Изменить бронирование      | ✓ staff     |
| DELETE| /api/bookings/{id} | Удалить бронирование       | ✓ staff     |

## Структура проекта

```
├── backend/          # Django + Django Ninja
│   ├── config/       # Настройки проекта
│   └── flights/      # Модели, API, seed-данные
├── frontend/         # React (Vite)
│   └── src/
│       ├── pages/    # Страницы
│       ├── components/
│       └── context/  # Авторизация
└── docker-compose.yml
```
