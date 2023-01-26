from django.db import models

from django.contrib.auth.models import AbstractUser 
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator

from datetime import timedelta

from .managers import UserManager


class User(AbstractUser):
    """User model."""

    username = None
    email = models.EmailField(_('email address'), unique=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


class Club(models.Model):
    name = models.TextField(max_length=50)
    description = models.TextField(max_length=200, default="Uzupełnij informacje o klubie")

    def __str__(self):
        return str(self.id) + '. ' + self.name


class CoachProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    avatar = models.ImageField(default='media/profile_images/avatar.svg', upload_to='media/profile_images/')

    def __str__(self):
        return str(self.id) + '. ' + self.name + ' ' + self.last_name


class SportsManProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    avatar = models.ImageField(default='media/profile_images/avatar.svg', upload_to='media/profile_images/')
    coach = models.ForeignKey(CoachProfile, on_delete=models.SET_NULL, null=True)
    club = models.ForeignKey(Club, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return str(self.id) + '. ' + self.name + ' ' + self.last_name


class Message(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver')
    body = models.TextField(max_length=200, default='')
    seen = models.BooleanField(default=False)

    class Meta:
        ordering = ('-date',)
    
    def __str__(self):
        return str(self.id) + '. ' + self.body[:20]


class Workout(models.Model):
    date = models.DateField()
    title = models.TextField(max_length=100)
    expected_duration = models.TextField(max_length=50)
    duration = models.DurationField(default=timedelta(minutes=0))
    mark = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10)
        ]
    )
    sportsman = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sportsman')
    coach = models.ForeignKey(User, on_delete=models.CASCADE, related_name='coach')
    comment = models.TextField(max_length=100, null=True, blank=True)

    class Meta:
        ordering = ('-date',)
    
    def __str__(self):
        return str(self.id) + '. ' + self.title
