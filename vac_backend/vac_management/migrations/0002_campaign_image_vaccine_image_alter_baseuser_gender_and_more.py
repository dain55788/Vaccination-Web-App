<<<<<<< HEAD
# Generated by Django 5.1.7 on 2025-04-09 09:04
=======
# Generated by Django 5.1.7 on 2025-04-09 08:02
>>>>>>> f12e9f97f1a60c0981d8dee80ee911bfd86193d6

import cloudinary.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vac_management', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaign',
            name='image',
            field=cloudinary.models.CloudinaryField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='vaccine',
            name='image',
            field=cloudinary.models.CloudinaryField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='baseuser',
            name='gender',
<<<<<<< HEAD
            field=models.CharField(choices=[('male', 'Male'), ('female', 'Female')], max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='campaign',
            name='status',
            field=models.CharField(choices=[('planned', 'Planned'), ('ongoing', 'Ongoing'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='planned', max_length=10),
=======
            field=models.BooleanField(choices=[('male', 'Male'), ('female', 'Female')], null=True),
>>>>>>> f12e9f97f1a60c0981d8dee80ee911bfd86193d6
        ),
        migrations.AlterField(
            model_name='vaccinecategory',
            name='category_name',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
