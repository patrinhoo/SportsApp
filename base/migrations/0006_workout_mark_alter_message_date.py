# Generated by Django 4.1.4 on 2023-01-19 10:41

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0005_message_seen"),
    ]

    operations = [
        migrations.AddField(
            model_name="workout",
            name="mark",
            field=models.IntegerField(
                default=0,
                validators=[
                    django.core.validators.MinValueValidator(0),
                    django.core.validators.MaxValueValidator(10),
                ],
            ),
        ),
        migrations.AlterField(
            model_name="message",
            name="date",
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]