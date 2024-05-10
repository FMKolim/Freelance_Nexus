import json
import API.models
import API.serializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.core.mail import EmailMessage
from django.http import JsonResponse
#Import necessary libraries


class TokenView(TokenObtainPairView):

    serializer_class = API.serializer.Token


class RegisterView(generics.CreateAPIView):
    
    permission_classes = ([AllowAny])

    serializer_class = API.serializer.RegisterSeri
#Deal with user authentication, TokenView generates the tokens for users, RegisterView handles new registerations of users.


@api_view(['GET'])
def AllUserAds(request):
    
    ads = API.models.Advert.objects.all()

    AllAds = []
    #Empty list to store all adverts

    for ad in ads:

        AdDetails = {

            'id': ad.id,

            'AdTitle': ad.AdTitle,

            'AdDesc': ad.AdDesc,

            'AdPay': ad.AdPay,

            'AdDate': ad.AdDate,

            'AdOwner': ad.AdOwner.username   
        }

        AllAds.append(AdDetails)

    return Response(AllAds, status=status.HTTP_200_OK)
#In charge of fetching all adverts stored in the database    

@api_view(['GET'])
def getTags(request):

    tags = API.models.Tag.objects.all()

    serializer = API.serializer.TagSerializer(tags, many = True)

    return Response(serializer.data)
#Gets all the tags made and saved on database
    
    
@api_view(['GET'])
def getAd(request, pk):

    try:

        ads = API.models.Advert.objects.get(pk = pk)

    except API.models.Advert.DoesNotExist:

        return Response({'error': 'Advert not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = API.serializer.AdvertSerialzier(ads)

    return Response(serializer.data, status=status.HTTP_200_OK)
#Gets a specific advert from the database

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_advert(request):

    serializer = API.serializer.AdvertSerialzier(data=request.data)

    if serializer.is_valid():

        serializer.save(AdOwner = request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#Function for creating and saving an advert in the database

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_advert(request, pk):
    try:
        ad = API.models.Advert.objects.get(pk=pk)

    except API.models.Advert.DoesNotExist:

        return Response({'error': 'Advert not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if the user is the advert owner or an admin
    if ad.AdOwner != request.user and not request.user.is_staff:

        return Response({'error': 'You are not authorized to edit this advert'}, status=status.HTTP_403_FORBIDDEN)

    serializer = API.serializer.AdvertSerialzier(ad, data=request.data)

    if serializer.is_valid():
        #checks if data is valid

        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#When user changes information about advert this function takes care of the processing


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_advert(request, pk):

    try:

        ads = API.models.Advert.objects.get(pk=pk)

        if request.user == ads.AdOwner:

            ads.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        
        else:
            return Response({'error': 'You are not authorized to delete this advert.'}, status=status.HTTP_403_FORBIDDEN)
    
    except API.models.Advert.DoesNotExist:

        return Response({'error': 'Advert not found'}, status=status.HTTP_404_NOT_FOUND)

#Function to delete the advert off the system


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    
    try:
    
        profile = API.models.Profile.objects.get(user=request.user)
    
    except API.models.Profile.DoesNotExist:
    
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
   
    profile_serializer = API.serializer.ProfileSerializer(profile, data=request.data, partial=True)

    user_serializer = API.serializer.UserSerializer(request.user, data={'username': request.data.get('name')}, partial=True)

    if profile_serializer.is_valid() and user_serializer.is_valid():

        profile_serializer.save()

        user_serializer.save()

        return Response({'success': 'Profile updated successfully'}, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
#Changes the user information in the system

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request, pk):

    try:
        advert = API.models.Advert.objects.get(pk=pk)

    except API.models.Advert.DoesNotExist:

        return Response({'error': 'Advert not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer_data = request.data.copy()

    serializer_data['CommentedAdvert'] = pk 
    
    username = serializer_data.get('CommentOwner')

    if username is None:

        return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:

        user = API.models.User.objects.get(username=username)

    except API.models.User.DoesNotExist:

        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer_data['CommentOwnerEmail'] = user.email
    
    serializer = API.serializer.CommentSerializer(data=serializer_data)

    if serializer.is_valid():

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#Creates a comment associated with an advert 


@api_view(['GET'])
def get_comments(request):

    comments = API.models.Comment.objects.all()

    serializer = API.serializer.CommentSerializer(comments, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)
#Gets all saved comments from database


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_mail(request):
    
    try:

        data = json.loads(request.body)

        subject = data.get('subject', '')  

        message = data.get('message', '')  

        recipient = data.get('recipient', '')  


        msg = EmailMessage(subject, message, to=[recipient])

        msg.send()
    
        
        return JsonResponse({'success': True, 'message': 'Email sent successfully'})
    
    except Exception as e:
    
        return JsonResponse({'success': False, 'message': str(e)})
#Function that handles the sending of emails from system



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_deadline(request):

    serializer = API.serializer.DeadlineSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save(ProjectOwner=request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#Adding deadlines to database and associating them with a user


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_deadline(request, pk):
    try:
        deadline = API.models.Deadlines.objects.get(pk=pk)

    except API.models.Deadlines.DoesNotExist:

        return Response({'error': 'Deadline not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if deadline.ProjectOwner != request.user:
        return Response({'error': 'You are not authorized to delete this deadline'}, status=status.HTTP_403_FORBIDDEN)

    deadline.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)
#Deletion of deadlines
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_deadlines(request):

    try:

        deadlines = API.models.Deadlines.objects.all()

        serializer = API.serializer.DeadlineSerializer(deadlines, many=True)

        return Response(serializer.data)
    
    except Exception as e:

        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#Fetch all deadlines stored in the system
