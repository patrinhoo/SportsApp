from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView
from . import views


urlpatterns = [
    path('', views.getRoutes),

    path('workouts/', views.getWorkouts),
    path('workouts/<int:pk>/', views.getWorkout),
    path('add_workout/<int:pk>/', views.addWorkout),

    path('mysportsmen/', views.getMySportsMen),
    path('mysportsman_workouts/<int:pk>/', views.getMySportsManWorkouts),
    path('workouts_coach/<int:pk>/', views.getWorkoutCoach),
    path('comment/<int:pk>/', views.editComment),
    path('mark/<int:pk>/', views.markWorkout),
    path('result/<int:pk>/', views.workoutResult),
    path('report/', views.getWorkoutsReport),

    path('sportsmanprofile/', views.getSportsManProfile),
    path('sportsmanprofile_edit/', views.editSportsManProfile),
    path('sportsman_register/', views.registerSportsMan),
    path('available_coaches/', views.getAvailableCoaches),

    path('coachprofile/', views.getCoachProfile),
    path('coachprofile_edit/', views.editCoachProfile),
    path('coach_register/', views.registerCoach),

    path('club/<int:pk>/', views.getClub),
    path('clubs/', views.getAvailableClubs),
    path('leave_club/', views.leaveClub),
    path('join_club/<int:pk>/', views.joinClub),

    path('my_conversations/', views.getMyConversations),
    path('conversation/<int:pk>/', views.getConversation),
    path('send_message/<int:pk>/', views.sendMessage),
    path('send_group_message/', views.sendGroupMessage),
    path('unseen_messages/', views.checkUnseenMessages),
    
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]