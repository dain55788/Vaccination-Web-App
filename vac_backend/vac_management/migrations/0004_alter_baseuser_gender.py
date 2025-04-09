# Generated by Django 5.1.7 on 2025-04-09 08:58

from django.db import migrations, models


def noop(apps, schema_editor):
    # No operation, just skip this migration
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('vac_management', '0003_alter_baseuser_gender'),
    ]

    operations = [
        migrations.RunPython(noop, reverse_code=migrations.RunPython.noop),
    ]
