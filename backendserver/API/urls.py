from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from API import views


urlpatterns = [

    path('token/', views.TokenView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('signup/', views.RegisterView.as_view()),
    path('all-ads/', views.AllUserAds),
    path('ad/<int:pk>/', views.getAd),
    path('create-advert/', views.create_advert),
    path('update-advert/<int:pk>/', views.update_advert),
    path('delete/<int:pk>/', views.delete_advert),
    path('all-tags/', views.getTags),
    path('update-profile/', views.update_profile),
    path('create-comment/<int:pk>/', views.create_comment),
    path('get-comments/', views.get_comments),
    path('send-mail/', views.send_mail),
    path('add-deadline/', views.add_deadline),
    path('delete-deadline/<int:pk>/', views.delete_deadline),
    path('all-deadlines/', views.all_deadlines),
]

#All links going to seperate view functions are specified here.