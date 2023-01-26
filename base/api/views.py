from django.http import JsonResponse
from django.db.models import Q
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (WorkoutSerializer, MySportsMenSerializer, CoachProfileSerializer, SportsManProfileSerializer, 
    RegisterUserSerializer, RegisterCoachSerializer, RegisterSportsManSerializer, ClubSerializer, MessageSerializer)
from base.models import (Workout, CoachProfile, SportsManProfile, User, Club, Message)

from datetime import timedelta
import datetime


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        if CoachProfile.objects.filter(user=user):
            token['coach'] = True
        else:
            token['coach'] = False
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/token/refresh/',

        '/api/workouts/', 
        '/api/workouts/<int:pk>/',
        '/api/add_workout/<int:pk>/',

        '/api/mysportsmen/',
        '/api/mysportsman_workouts/<int:pk>/',
        '/api/workouts_coach/<int:pk>/',
        '/api/comment/<int:pk>/',
        '/api/mark/<int:pk>/',

        '/api/sportsmanprofile/',
        '/api/sportsmanprofile_edit/',
        '/api/sportsman_register/',
        '/api/available_coaches/',

        '/api/coachprofile/',
        '/api/coachprofile_edit/',
        '/api/coach_register/',

        '/api/club/<int:pk>/',
        '/api/clubs/',
        '/api/leave_club/',
        '/api/join_club/<int:pk>/',

        '/api/my_conversations/',
        '/api/conversation/<int:pk>/',
        '/api/send_message/<int:pk>/',
        '/api/send_group_message/',
        '/api/unseen_messages/',
    ]

    return Response(routes)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getWorkouts(request):
    sportsman = request.user

    workouts = Workout.objects.filter(sportsman=sportsman)
    if workouts:
        serializer = WorkoutSerializer(workouts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getWorkout(request, pk):
    user = request.user

    try:
        workout = Workout.objects.get(id=pk)

        if workout.sportsman == user:
            serializer = WorkoutSerializer(workout, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            error_data = {
                'message': 'Are you sure you are allowed to see this Workout?'
            }
            return Response(error_data, status=status.HTTP_403_FORBIDDEN)
    except:
        error_data = {
            'message': 'Are you sure this is correct Workout?'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMySportsMen(request):
    user = request.user
    try:
        coach = CoachProfile.objects.get(user=user)
        mySportsMen = SportsManProfile.objects.filter(coach=coach)
        serializer = MySportsMenSerializer(mySportsMen, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Are you sure you are Coach?'
        }
        return Response(error_data, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMySportsManWorkouts(request, pk):
    coach = request.user

    try:
        sportsman_profile = SportsManProfile.objects.get(id=pk)
        sportsman_serializer = SportsManProfileSerializer(sportsman_profile, many=False)

        workouts = Workout.objects.filter(sportsman=sportsman_profile.user, coach=coach)
        workout_serializer = WorkoutSerializer(workouts, many=True)

        return Response({'workouts': workout_serializer.data, 'sportsman': sportsman_serializer.data}, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Are you sure you are Coach of this SportsMan?'
        }
        return Response(error_data, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getWorkoutCoach(request, pk):
    user = request.user

    try:
        workout = Workout.objects.get(id=pk)

        if workout.coach == user:
            workout_serializer = WorkoutSerializer(workout, many=False)

            sportsman_profile = SportsManProfile.objects.get(user=workout.sportsman)
            sportsman_serializer = SportsManProfileSerializer(sportsman_profile, many=False)

            return Response({'workout': workout_serializer.data, 'sportsman': sportsman_serializer.data}, status=status.HTTP_200_OK)
        else:
            error_data = {
                'message': 'Are you sure you are allowed to see this Workout?'
            }
            return Response(error_data, status=status.HTTP_403_FORBIDDEN)
    except:
        error_data = {
            'message': 'Are you sure this is correct Workout?'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCoachProfile(request):
    user = request.user
    try:
        coach = CoachProfile.objects.get(user=user)
        serializer = CoachProfileSerializer(coach, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Are you sure you are Coach?'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editCoachProfile(request):
    user = request.user
    try:
        coach_profile = CoachProfile.objects.get(user=user)

        if 'name' in  request.data:
            coach_profile.name = request.data['name']

        if 'last_name' in request.data:
            coach_profile.last_name = request.data['last_name']

        if 'avatar' in  request.data:
            if request.data['avatar']:
                coach_profile.avatar = request.data['avatar']

        coach_profile.save()

        serializer = CoachProfileSerializer(coach_profile, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Are you sure you are Coach?'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def registerCoach(request):
    user_serializer = RegisterUserSerializer(data=request.data)
    data = {}

    if user_serializer.is_valid():
        user = user_serializer.save()

        register_coach_data = {}
        register_coach_data['user'] = user.id
        register_coach_data['name'] = request.data.get('name', None)
        register_coach_data['last_name'] = request.data.get('last_name', None)
        
        register_coach_serializer = RegisterCoachSerializer(data=register_coach_data)

        if register_coach_serializer.is_valid():
            coach_profile = register_coach_serializer.save()
            
            data = CoachProfileSerializer(coach_profile).data
            return Response(status=status.HTTP_201_CREATED)
        else:
            data = register_coach_serializer.errors
            user.delete()
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
    else:
        data = user_serializer.errors
        return Response(data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSportsManProfile(request):
    user = request.user
    try:
        sportsMan = SportsManProfile.objects.get(user=user)
        serializer = SportsManProfileSerializer(sportsMan, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Are you sure you are SportsMan?'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editSportsManProfile(request):
    user = request.user
    try:
        sportsman_profile = SportsManProfile.objects.get(user=user)

        if 'name' in  request.data:
            sportsman_profile.name = request.data['name']

        if 'last_name' in request.data:
            sportsman_profile.last_name = request.data['last_name']

        if 'avatar' in  request.data:
            if request.data['avatar']:
                sportsman_profile.avatar = request.data['avatar']

        sportsman_profile.save()

        serializer = SportsManProfileSerializer(sportsman_profile, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Are you sure you are Sportsman?'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def registerSportsMan(request):
    user_serializer = RegisterUserSerializer(data=request.data)
    data = {}

    if user_serializer.is_valid():
        user = user_serializer.save()

        register_sportsman_data = {}
        register_sportsman_data['user'] = user.id
        register_sportsman_data['name'] = request.data.get('name', None)
        register_sportsman_data['last_name'] = request.data.get('last_name', None)
        register_sportsman_data['coach'] = request.data.get('coach', None)
        
        register_sportsman_serializer = RegisterSportsManSerializer(data=register_sportsman_data)

        if register_sportsman_serializer.is_valid():
            sportsman_profile = register_sportsman_serializer.save()
            
            data = SportsManProfileSerializer(sportsman_profile).data
            return Response(status=status.HTTP_201_CREATED)
        else:
            data = register_sportsman_serializer.errors
            user.delete()
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
    else:
        data = user_serializer.errors
        return Response(data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getAvailableCoaches(request):
    try:
        coach_profile = CoachProfile.objects.all()
        serializer = CoachProfileSerializer(coach_profile, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Something went wrong!'
        }
        return Response(error_data, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editComment(request, pk):
    user = request.user

    try:
        workout = Workout.objects.get(id=pk)
        if workout.coach == user:
            workout.comment = request.data['comment']
            workout.save()

            serializer = WorkoutSerializer(workout, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            error_data = {
                'message': 'Are you sure you are allowed to comment this Workout?'
            }
            return Response(error_data, status=status.HTTP_403_FORBIDDEN)
    except:
        error_data = {
            'message': 'Are you sure this is correct Workout?'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def markWorkout(request, pk):
    user = request.user

    try:
        workout = Workout.objects.get(id=pk)
        if workout.coach == user:
            if int(request.data['mark']) >= 0 and int(request.data['mark']) <= 10:
                workout.mark = int(request.data['mark'])
                workout.save()

                serializer = WorkoutSerializer(workout, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                error_data = {
                    'message': 'Mark cannot be smaller than 0 or bigger than 10'
                }
                return Response(error_data, status=status.HTTP_400_BAD_REQUEST)
        else:
            error_data = {
                'message': 'Are you sure you are allowed to mark this Workout?'
            }
            return Response(error_data, status=status.HTTP_403_FORBIDDEN)
    except:
        error_data = {
            'message': 'Are you sure this is correct Workout?'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def workoutResult(request, pk):
    user = request.user

    try:
        workout = Workout.objects.get(id=pk)
        if workout.coach == user:
            if int(request.data['hours']) >= 0 and int(request.data['hours']) <= 23 and int(
                request.data['mins']) >= 0 and int(request.data['mins']) <= 59 and int(
                request.data['seconds']) >= 0 and int(request.data['seconds']) <= 59:

                workout.duration = timedelta(hours=int(request.data['hours']), minutes=int(request.data['mins']), seconds=int(request.data['seconds']))
                workout.save()

                serializer = WorkoutSerializer(workout, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                error_data = {
                    'message': 'Result must be shorter than 24h!'
                }
                return Response(error_data, status=status.HTTP_400_BAD_REQUEST)
        else:
            error_data = {
                'message': 'Are you sure you are allowed to change result of this Workout?'
            }
            return Response(error_data, status=status.HTTP_403_FORBIDDEN)
    except:
        error_data = {
            'message': 'Are you sure this is correct Workout?'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addWorkout(request, pk):
    user = request.user

    try:
        sportsman_profile = SportsManProfile.objects.get(id=pk)
        coach_profile = CoachProfile.objects.get(user=user)

        if sportsman_profile.coach == coach_profile:
            workout_date = datetime.datetime.strptime(request.data.get('date', None), "%Y-%m-%d").date()

            workout = Workout.objects.create(
                date = workout_date,
                title = request.data.get('title', None),
                expected_duration = request.data.get('duration', None),
                sportsman = sportsman_profile.user,
                coach = coach_profile.user,
                comment = ''
            )

            serializer = WorkoutSerializer(workout, many=False)
            return Response(status=status.HTTP_201_CREATED)
        else:
            error_data = {
                'message': 'Are you sure you are Coach of this SportsMan?'
            }
            return Response(error_data, status=status.HTTP_403_FORBIDDEN)
    except:
        error_data = {
            'message': 'Are you sure you are a Coach and this is your SportsMan?'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getClub(request, pk):
    try:
        club = Club.objects.get(id=pk)
        serializer = ClubSerializer(club, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Error occured while Getting Club!'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAvailableClubs(request):
    try:
        clubs = Club.objects.all()
        serializer = ClubSerializer(clubs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Error occured while Getting Available Clubs!'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leaveClub(request):
    user = request.user

    try:
        sportsman_profile = SportsManProfile.objects.get(user=user)
        sportsman_profile.club = None
        sportsman_profile.save()

        serializer = SportsManProfileSerializer(sportsman_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Error occured while Leaving Club!'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def joinClub(request, pk):
    user = request.user

    try:
        sportsman_profile = SportsManProfile.objects.get(user=user)
        club = Club.objects.get(id=pk)

        sportsman_profile.club = club
        sportsman_profile.save()

        serializer = SportsManProfileSerializer(sportsman_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Error occured while Joining Club!'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyConversations(request):
    user = request.user

    try:
        if SportsManProfile.objects.filter(user=user):
            sportsman_profile = SportsManProfile.objects.get(user=user)
            coach_profile = sportsman_profile.coach

            messages = Message.objects.filter(sender=coach_profile.user, receiver=user, seen=False)

            coach_conversations = [{
                'id': coach_profile.user.id,
                'name': coach_profile.name,
                'last_name': coach_profile.last_name,
                'avatar': coach_profile.avatar.url,
                'unseen': len(messages)
            }]

            return Response(coach_conversations, status=status.HTTP_200_OK)

        elif CoachProfile.objects.filter(user=user):
            coach_profile = CoachProfile.objects.get(user=user)
            my_sportsmen = SportsManProfile.objects.filter(coach=coach_profile)

            sportsman_conversations = []

            for sportsman in my_sportsmen:
                received_messages = Message.objects.filter(sender=sportsman.user, receiver=user, seen=False)
                send_messages = Message.objects.filter(sender=user, receiver=sportsman.user, seen=False)

                sportsman_conversations.append({
                    'id': sportsman.user.id,
                    'name': sportsman.name, 
                    'last_name': sportsman.last_name,
                    'avatar': sportsman.avatar.url,
                    'unseen': len(received_messages),
                    'send_unseen': len(send_messages)
                })

            return Response(sportsman_conversations, status=status.HTTP_200_OK)

        else:
            error_data = {
                'message': 'Error occured while getting Conversations!'
            }
            return Response(error_data, status=status.HTTP_400_BAD_REQUEST)
    except:
        error_data = {
            'message': 'Error occured while getting Conversations!'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getConversation(request, pk):
    user = request.user

    try:
        interlocutor = User.objects.get(id=pk)
        interlocutor_profile = CoachProfile.objects.filter(user=interlocutor)

        if interlocutor_profile:
            interlocutor_profile = interlocutor_profile.first()
            interlocutor_serializer = CoachProfileSerializer(interlocutor_profile)
        else:
            interlocutor_profile = SportsManProfile.objects.get(user=interlocutor)
            interlocutor_serializer = SportsManProfileSerializer(interlocutor_profile)


        messages = Message.objects.filter(Q(sender=user, receiver=interlocutor) |  Q(sender=interlocutor, receiver=user)).order_by('id')

        conversation_messages = []

        for message in messages:
            if message.receiver == user:
                message.seen = True
                message.save()

            conversation_messages.append({
                'id': message.id,
                'body': message.body,
                'amIAuthor': message.sender == user,
            })

        return Response({'messages': conversation_messages, 'interlocutor': interlocutor_serializer.data}, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Error occured while getting Conversation!'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sendMessage(request, pk):
    user = request.user

    try:
        interlocutor = User.objects.get(id=pk)
        user_profile = CoachProfile.objects.filter(user=user)

        body = request.data.get('body', None)

        if user_profile:
            user_profile = user_profile.first()
            sportsman_profile = SportsManProfile.objects.get(user=interlocutor)

            if sportsman_profile.coach == user_profile and body:
                message = Message.objects.create(sender=user, receiver=interlocutor, body=body)
            
        else:
            user_profile = SportsManProfile.objects.get(user=user)
            coach_profile = CoachProfile.objects.get(user=interlocutor)

            if user_profile.coach == coach_profile and body:
                message = Message.objects.create(sender=user, receiver=interlocutor, body=body)

        if message:
            message_serializer = MessageSerializer(message)

            return Response({'message': message_serializer.data}, status=status.HTTP_201_CREATED)

        else:
            error_data = {
                'message': 'Error occured while Sending Message!'
            }
            return Response(error_data, status=status.HTTP_400_BAD_REQUEST)

    except:
        error_data = {
            'message': 'Error occured while Sending Message!'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sendGroupMessage(request):
    user = request.user

    try:
        coach_profile = CoachProfile.objects.get(user=user)

        sportsmen_profiles = SportsManProfile.objects.filter(coach=coach_profile)

        body = request.data.get('body', None)

        for sportsman_profile in sportsmen_profiles:
            message = Message.objects.create(sender=user, receiver=sportsman_profile.user, body=body)

        return Response(status=status.HTTP_201_CREATED)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def checkUnseenMessages(request):
    user = request.user

    try:
        unseen_messages = Message.objects.filter(receiver=user, seen=False)

        return Response({'unseen': len(unseen_messages)}, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Error occured while Getting Unseen Messages!'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)

from django.db.models import Count, Avg

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getWorkoutsReport(request):
    user = request.user

    try:
        coach_profile = CoachProfile.objects.get(user=user)
        print(coach_profile)
        print('HERE')

        my_workouts = Workout.objects.filter(coach=user)

        workout_names = my_workouts.values('title').annotate(count=Count('id'))

        report_data = []

        for nr, workout_name in enumerate(workout_names):
            workouts = my_workouts.filter(title=workout_name['title'])

            report_item = {}
            report_item['id'] = nr
            report_item['title'] = workout_name['title']
            report_item['workouts_count'] = workout_name['count']

            workouts_w_mark = workouts.exclude(mark=0)

            report_item['mark_avg'] = workouts_w_mark.aggregate(mark_avg=Avg('mark'))['mark_avg']
            report_item['mark_count'] =  workouts_w_mark.aggregate(mark_count=Count('mark'))['mark_count']

            workouts_w_duration = workouts.exclude(duration=timedelta())

            report_item['duration_avg'] = workouts_w_duration.aggregate(duration_avg=Avg('duration'))['duration_avg']
            report_item['duration_count'] = workouts_w_duration.aggregate(duration_count=Count('duration'))['duration_count']

            report_data.append(report_item)

        return Response(report_data, status=status.HTTP_200_OK)
    except:
        error_data = {
            'message': 'Error occured while Getting Workouts Report!'
        }
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)
