from rest_framework.serializers import ModelSerializer, CharField, ValidationError
from base.models import Workout, SportsManProfile, CoachProfile, User, Club, Message


class WorkoutSerializer(ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'


class MySportsMenSerializer(ModelSerializer):
    class Meta:
        model = SportsManProfile
        fields = '__all__'


class CoachProfileSerializer(ModelSerializer):
    class Meta:
        model = CoachProfile
        fields = '__all__'


class SportsManProfileSerializer(ModelSerializer):
    class Meta:
        model = SportsManProfile
        fields = '__all__'


class ClubSerializer(ModelSerializer):
    class Meta:
        model = Club
        fields = '__all__'


class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


class RegisterUserSerializer(ModelSerializer):
    password2 = CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        user = User(email=self.validated_data['email'])

        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise ValidationError({'password': 'Passwords must match'})

        if len(password) < 8:
            raise ValidationError({'password': 'Password too short (min 8)'})

        user.set_password(password)
        user.save()
        return user


class RegisterCoachSerializer(ModelSerializer):
    class Meta:
        model = CoachProfile
        fields = ['user', 'name', 'last_name']


class RegisterSportsManSerializer(ModelSerializer):
    class Meta:
        model = SportsManProfile
        fields = ['user', 'name', 'last_name', 'coach']
