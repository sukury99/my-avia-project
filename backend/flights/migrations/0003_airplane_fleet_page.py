from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flights', '0002_authtoken'),
    ]

    operations = [
        migrations.AddField(
            model_name='airplane',
            name='fleet_page',
            field=models.PositiveSmallIntegerField(default=1, verbose_name='Страница флота'),
        ),
    ]
