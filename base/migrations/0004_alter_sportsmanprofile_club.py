# Generated by Django 4.1.4 on 2023-01-16 12:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0003_sportsmanprofile_club"),
    ]

    operations = [
        migrations.AlterField(
            model_name="sportsmanprofile",
            name="club",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="base.club",
            ),
        ),
    ]