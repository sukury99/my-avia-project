from decimal import Decimal
from pathlib import Path

from django.contrib.auth.models import User
from django.core.files import File
from django.core.management.base import BaseCommand

from flights.models import Airplane

AIRPLANES = [
    {
        'name': 'Cessna Citation CJ3',
        'price': Decimal('320000'),
        'description': 'Компактный бизнес-джет для региональных перелётов. Вместительная кабина и отличная экономичность.',
        'filename': '01-citation-cj3.jpg',
        'fleet_page': 1,
    },
    {
        'name': 'Embraer Phenom 300E',
        'price': Decimal('280000'),
        'description': 'Лёгкий джет премиум-класса для 6–9 пассажиров. Манёвренный и экономичный.',
        'filename': '02-phenom-300e.jpg',
        'fleet_page': 1,
    },
    {
        'name': 'HondaJet',
        'price': Decimal('310000'),
        'description': 'Инновационный лёгкий джет с уникальным расположением двигателей и стильным дизайном.',
        'filename': '03-hondajet.jpg',
        'fleet_page': 1,
    },
    {
        'name': 'Learjet 75',
        'price': Decimal('350000'),
        'description': 'Легендарная серия Learjet. Высокая скорость и комфорт для деловых поездок.',
        'filename': '04-learjet-75.jpg',
        'fleet_page': 1,
    },
    {
        'name': 'Pilatus PC-24',
        'price': Decimal('380000'),
        'description': 'Суперлёгкий джет с возможностью посадки на короткие полосы. Универсален для любых маршрутов.',
        'filename': '05-pilatus-pc24.jpg',
        'fleet_page': 1,
    },
    {
        'name': 'Gulfstream G280',
        'price': Decimal('520000'),
        'description': 'Средний бизнес-джет с дальностью до 6 667 км. Просторная кабина и передовые технологии.',
        'filename': '07-gulfstream-g280.jpg',
        'fleet_page': 1,
    },
    {
        'name': 'Challenger 350',
        'price': Decimal('450000'),
        'description': 'Супер-средний джет с широкой кабиной. Идеален для трансконтинентальных перелётов.',
        'filename': '08-challenger-350.jpg',
        'fleet_page': 2,
    },
    {
        'name': 'Falcon 2000LXS',
        'price': Decimal('580000'),
        'description': 'Двухмоторный бизнес-джет Dassault. Тихая кабина и изысканный французский интерьер.',
        'filename': '09-falcon-2000lxs.jpg',
        'fleet_page': 2,
    },
    {
        'name': 'Embraer Praetor 600',
        'price': Decimal('420000'),
        'description': 'Супер-средний джет с дальностью до 7 400 км. Современная авионика и комфорт.',
        'filename': '10-praetor-600.jpg',
        'fleet_page': 2,
    },
    {
        'name': 'Dassault Falcon 8X',
        'price': Decimal('780000'),
        'description': 'Флагманский трёхмоторный джет. Дальность до 11 945 км и три жилые зоны.',
        'filename': '13-falcon-8x.jpg',
        'fleet_page': 2,
    },
    {
        'name': 'Gulfstream G700',
        'price': Decimal('950000'),
        'description': 'Новейший флагман Gulfstream. Самая большая кабина в классе и дальность до 13 890 км.',
        'filename': '17-gulfstream-g700.jpg',
        'fleet_page': 2,
    },
    {
        'name': 'Citation X+',
        'price': Decimal('480000'),
        'description': 'Один из самых быстрых бизнес-джетов в мире. Скорость до 972 км/ч.',
        'filename': '18-citation-x-plus.jpg',
        'fleet_page': 2,
    },
]

SEED_IMAGES_DIR = Path(__file__).resolve().parents[3] / 'seed_images'
PROJECT_ROOT = Path(__file__).resolve().parents[4]


def _resolve_image_path(filename: str) -> Path | None:
    for directory in (SEED_IMAGES_DIR, PROJECT_ROOT):
        path = directory / filename
        if path.exists():
            return path
    return None


def _attach_image(airplane: Airplane, filename: str):
    image_path = _resolve_image_path(filename)
    if not image_path:
        return
    if airplane.image:
        airplane.image.delete(save=False)
    with image_path.open('rb') as f:
        airplane.image.save(filename, File(f), save=False)


class Command(BaseCommand):
    help = 'Заполняет БД тестовыми данными'

    def handle(self, *args, **options):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@jetbook.ru', 'admin123')
            self.stdout.write(self.style.SUCCESS('Создан админ: admin / admin123'))

        if not User.objects.filter(username='user').exists():
            User.objects.create_user('user', 'user@jetbook.ru', 'user123')
            self.stdout.write(self.style.SUCCESS('Создан пользователь: user / user123'))

        Airplane.objects.all().delete()
        self.stdout.write('Старый флот удалён.')

        for data in AIRPLANES:
            airplane = Airplane(
                name=data['name'],
                price=data['price'],
                description=data['description'],
                fleet_page=data['fleet_page'],
            )
            _attach_image(airplane, data['filename'])
            airplane.save()
            self.stdout.write(f'  + {airplane.name} (страница {airplane.fleet_page})')

        self.stdout.write(self.style.SUCCESS('База данных заполнена!'))
