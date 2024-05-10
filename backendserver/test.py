from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken
import API.models
import API.views
import json

#TESTING file for unit testing!!

class APITests(TestCase):

    def default(self):
        self.client = APIClient()


    def test_NewUserTest(self):

        url = 'http://127.0.0.1:8000/api/signup/'

        data = {
            
            'email': 'testinguser@gmail.com',
            
            'username': 'TestingUser',
            
            'password': 'TestFreelanceNexus',
            
            'passwordtwo': 'TestFreelanceNexus'
        }
        #Data to make a new user with

        response = self.client.post(url, data, format = 'application/json')
        #Makes a request with the new data

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        #Checks to see if returned code is 201 indicating user was made

        self.assertTrue(API.models.User.objects.filter(username='TestingUser').exists())
        #Checks database to see if user is made with same name as the one sent

    def test_ExistingUser(self):
        #Create an existing user
        ExistingUser = API.models.User.objects.create_user(
            
            email = 'ExistingUser@gmail.com',
            
            username = 'ExistingUser',
            
            password = 'ExistingFreelance123'
        )

        url = 'http://127.0.0.1:8000/api/signup/'

        #Input new user data
        data = {
            
            'email': 'ExistingUser@gmail.com',
            
            'username': 'NewExistingUser',
            
            'password': 'ExistingFreelanceNexus',
            
            'passwordtwo': 'ExistingFreelanceNexus'
        }

        #Make a request to create a new user
        response = self.client.post(url, data, format = 'json')

        #If user already exists and 400 code response is recieved
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        #Ensures no new user with same email and NewExistingUser username is created in database
        self.assertFalse(API.models.User.objects.filter(username = 'NewExistingUser').exists())

    def test_Login(self):

        ExistingUser = API.models.User.objects.create_user(
            
            email = 'ExistingUser@gmail.com',
            
            username = 'ExistingUser',
            
            password = 'ExistingFreelance123'

        )

        url = 'http://127.0.0.1:8000/api/token/'

        login_data = {

            'email': 'ExistingUser@gmail.com',

            'password': 'ExistingFreelance123'

        }

        response = self.client.post(url, login_data, format = 'json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
    #Attempts to login to the system and succeeds

    def test_WrongLogin(self):

        ExistingUser = API.models.User.objects.create_user(
            
            email = 'ExistingUser@gmail.com',
            
            username = 'ExistingUser',
            
            password = 'ExistingFreelance123'
        )

        url = 'http://127.0.0.1:8000/api/token/'

        login_data = {

            'email': 'Existing@gmail.com',
            
            'password': 'ExistingFreelance123'
        }

        response = self.client.post(url, login_data, format = 'json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        #Attempts to login to the system with wrong information

    def test_AddPost(self):

        ExistingUser = API.models.User.objects.create_user(
            
            email = 'ExistingUser@gmail.com',
            
            username = 'ExistingUser',
            
            password = 'ExistingFreelance123'
        )

        token_pair = AccessToken.for_user(ExistingUser)
        
        accessToken = str(token_pair)
        #Creates an access token for the user

        url = 'http://127.0.0.1:8000/api/create-advert/'

        comment_data = {
            'AdTitle': 'Advert Test',
            'AdDesc': 'Testing the advert option',
            'AdPay': 30
        }

        headers = {'Authorization': f'Bearer {accessToken}'}
        
        # Convert comment_data to JSON string
        data = json.dumps(comment_data)

        response = self.client.post(url, data, content_type='application/json', HTTP_AUTHORIZATION=headers['Authorization'])

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertTrue(API.models.Advert.objects.filter(AdTitle='Advert Test').exists())
    #Attempts to post an advert as a logged in authenticated user


    def test_UnathorizedAddPost(self):

        url = 'http://127.0.0.1:8000/api/create-advert/'

        comment_data = {
            
            'AdTitle': 'Advert Test',
            
            'AdDesc': 'Testing the advert option',
            
            'AdPay': 30
        }

        data = json.dumps(comment_data)

        response = self.client.post(url, data, content_type = 'application/json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.assertFalse(API.models.Advert.objects.filter(AdTitle='Advert Test').exists())
    #Tries to post advert as unathorized user

    def test_EditPost(self):
        
        ExistingUser = API.models.User.objects.create_user(
            
            email = 'ExistingUser@gmail.com',
            
            username = 'ExistingUser',
            
            password = 'ExistingFreelance123'
        )

        token_pair = AccessToken.for_user(ExistingUser)

        accessToken = str(token_pair)

        headers = {'Authorization': f'Bearer {accessToken}'}

        ExistingPost = API.models.Advert.objects.create(
            
            AdTitle = 'Existing Advert',
            
            AdDesc = 'Existing Advert',
            
            AdPay = 30,
            
            AdOwner = ExistingUser
        )

        self.client.login(username = 'ExistingUser@gmail.com', password = 'ExistingFreelance123')

        newcomment_data = {
            
            'AdTitle': 'Advert Test',
            
            'AdDesc': 'Testing the advert option',
            
            'AdPay': 50
        }

        data = json.dumps(newcomment_data)

        url = f'http://127.0.0.1:8000/api/update-advert/{ExistingPost.id}/'

        response = self.client.put(url, data, content_type = 'application/json', HTTP_AUTHORIZATION=headers['Authorization'])

        self.assertEqual(response.status_code, status.HTTP_200_OK)
    #Tries to edit an advert 

    def test_EditNonExistantPost(self):
        
        ExistingUser = API.models.User.objects.create_user(
            
            email = 'ExistingUser@gmail.com',
            
            username = 'ExistingUser',
            
            password = 'ExistingFreelance123'
        )

        token_pair = AccessToken.for_user(ExistingUser)

        accessToken = str(token_pair)

        headers = {'Authorization': f'Bearer {accessToken}'}

        ExistingPost = API.models.Advert.objects.create(
            
            AdTitle = 'Existing Advert',
            
            AdDesc = 'Existing Advert',
            
            AdPay = 30,
            
            AdOwner = ExistingUser
        )

        self.client.login(username = 'ExistingUser@gmail.com', password = 'ExistingFreelance123')

        newcomment_data = {
            
            'AdTitle': 'Advert Test',
            
            'AdDesc': 'Testing the advert option',
            
            'AdPay': 50
        }

        data = json.dumps(newcomment_data)

        url = f'http://127.0.0.1:8000/api/update-advert/99999/'

        response = self.client.put(url, data, content_type = 'application/json', HTTP_AUTHORIZATION=headers['Authorization'])

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    #Tries to edit a post that doesnt exist

    def test_UnathorizedEditPost(self):

        ExistingUser = API.models.User.objects.create_user(
            
            email = 'ExistingUser@gmail.com',
            
            username = 'ExistingUser',
            
            password = 'ExistingFreelance123'
        )

        ExistingPost = API.models.Advert.objects.create(
            
            AdTitle = 'Existing Advert',
            
            AdDesc = 'Existing Advert',
            
            AdPay = 30,
            
            AdOwner = ExistingUser
        )

        newcomment_data = {
            
            'AdTitle': 'Advert Test',
            
            'AdDesc': 'Testing the advert option',
            
            'AdPay': 50
        }

        data = json.dumps(newcomment_data)

        url = f'http://127.0.0.1:8000/api/update-advert/{ExistingPost.id}/'

        response = self.client.put(url, data, content_type = 'application/json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    #Tries to edit a post as unauthorized user

    def test_UnathorizedOwnerEditPost(self):

        ExistingUser = API.models.User.objects.create_user(
            email = 'ExistingUser@gmail.com',
            username = 'ExistingUser',
            password = 'ExistingFreelance123'
        )

        AdOwner = API.models.User.objects.create_user(
            email = 'AdOwner@gmail.com',
            username = 'AdOwner',
            password = 'AdOwner123'
        )

        ExistingPost = API.models.Advert.objects.create(
            AdTitle = 'Existing Advert',
            AdDesc = 'Existing Advert',
            AdPay = 30,
            AdOwner = AdOwner
        )

        self.client.login(username = 'ExistingUser@gmail.com', password = 'ExistingFreelance123')

        token_pair = AccessToken.for_user(ExistingUser)

        accessToken = str(token_pair)

        headers = {'Authorization': f'Bearer {accessToken}'}

        newcomment_data = {
            'AdTitle': 'Advert Test',
            'AdDesc': 'Testing the advert option',
            'AdPay': 50
        }

        data = json.dumps(newcomment_data)

        url = f'http://127.0.0.1:8000/api/update-advert/{ExistingPost.id}/'

        response = self.client.put(url, data, content_type = 'application/json', HTTP_AUTHORIZATION=headers['Authorization'])

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    #Tries to edit the post as a user that isnt the owner of the advert

    def test_DeleteAdvert(self):
        
        ExistingUser = API.models.User.objects.create_user(
            email = 'ExistingUser@gmail.com',
            username = 'ExistingUser',
            password = 'ExistingFreelance123'
        )

        token_pair = AccessToken.for_user(ExistingUser)

        accessToken = str(token_pair)

        headers = {'Authorization': f'Bearer {accessToken}'}

        ExistingPost = API.models.Advert.objects.create(
            AdTitle = 'Existing Advert',
            AdDesc = 'Existing Advert',
            AdPay = 30,
            AdOwner = ExistingUser
        )

        self.client.login(username = 'ExistingUser@gmail.com', password = 'ExistingFreelance123')

        url = f'http://127.0.0.1:8000/api/delete/{ExistingPost.id}/'

        response = self.client.delete(url, content_type = 'application/json', HTTP_AUTHORIZATION=headers['Authorization'])

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)   

    #Tries to delete the advert as advert owner from system 

    def test_UnauthorizedDeleteAdvert(self):
        
        AdOwner = API.models.User.objects.create_user(
            email = 'AdOwner@gmail.com',
            username = 'AdOwner',
            password = 'AdOwner123'
        )

        ExistingPost = API.models.Advert.objects.create(
            AdTitle = 'Existing Advert',
            AdDesc = 'Existing Advert',
            AdPay = 30,
            AdOwner = AdOwner
        )
        
        LoggedInUser = API.models.User.objects.create_user(
            email = 'ExistingUser@gmail.com',
            username = 'ExistingUser',
            password = 'ExistingFreelance123'
        )

        token_pair = AccessToken.for_user(LoggedInUser)

        accessToken = str(token_pair)

        headers = {'Authorization': f'Bearer {accessToken}'}


        url = f'http://127.0.0.1:8000/api/delete/{ExistingPost.id}/'

        response = self.client.delete(url, content_type = 'application/json', HTTP_AUTHORIZATION=headers['Authorization'])

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    #Tries to delete the advert as the non advert owner

    def test_GetAllAdverts(self):

        AdOwner = API.models.User.objects.create_user(
            email = 'ExistingUser@gmail.com',
            username = 'ExistingUser',
            password = 'ExistingFreelance123'
        )

        self.advert1 = API.models.Advert.objects.create(
            AdTitle = 'Test Advert 1',
            AdDesc = 'Test Desc 1',
            AdPay = 50,
            AdOwner = AdOwner 
        )
                
        self.advert2 = API.models.Advert.objects.create(
            AdTitle = 'Test Advert 2',
            AdDesc = 'Test Desc 2',
            AdPay = 100,
            AdOwner = AdOwner 
        )

        self.advert3 = API.models.Advert.objects.create(
            AdTitle = 'Test Advert 3',
            AdDesc = 'Test Desc 3',
            AdPay = 200,
            AdOwner = AdOwner 
        )

        url = 'http://127.0.0.1:8000/api/all-ads/'

        response = self.client.get(url)

        self.assertEqual(len(response.data), 3)
    #Retrieves all adverts from the system

    def test_GetSpecificAdvert(self):

        AdOwner = API.models.User.objects.create_user(
            email = 'ExistingUser@gmail.com',
            username = 'ExistingUser',
            password = 'ExistingFreelance123'
        )

        self.advert1 = API.models.Advert.objects.create(
            AdTitle = 'Test Advert 1',
            AdDesc = 'Test Desc 1',
            AdPay = 50,
            AdOwner = AdOwner 
        )
                
        self.advert2 = API.models.Advert.objects.create(
            AdTitle = 'Test Advert 2',
            AdDesc = 'Test Desc 2',
            AdPay = 100,
            AdOwner = AdOwner 
        )

        self.advert3 = API.models.Advert.objects.create(
            AdTitle = 'Test Advert 3',
            AdDesc = 'Test Desc 3',
            AdPay = 200,
            AdOwner = AdOwner 
        )

        url = 'http://127.0.0.1:8000/api/ad/1/'

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
    #Retrieves a specific advert from the system

    def test_GetNonExistantAdvert(self):

        AdOwner = API.models.User.objects.create_user(
            email = 'ExistingUser@gmail.com',
            username = 'ExistingUser',
            password = 'ExistingFreelance123'
        )

        self.advert1 = API.models.Advert.objects.create(
            AdTitle = 'Test Advert 1',
            AdDesc = 'Test Desc 1',
            AdPay = 50,
            AdOwner = AdOwner 
        )
                
        self.advert2 = API.models.Advert.objects.create(
            AdTitle = 'Test Advert 2',
            AdDesc = 'Test Desc 2',
            AdPay = 100,
            AdOwner = AdOwner 
        )

        self.advert3 = API.models.Advert.objects.create(
            AdTitle = 'Test Advert 3',
            AdDesc = 'Test Desc 3',
            AdPay = 200,
            AdOwner = AdOwner 
        )

        url = 'http://127.0.0.1:8000/api/ad/999/'

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    #Tries to get an advert from the system that doesnt exist
    
    def test_UpdateProfile(self):

        ExistingUser = API.models.User.objects.create_user(
            email = 'ExamplerUser@gmail.com',
            username = 'ExamplerUser',
            password = 'ExamplerUser123'
        )

        token_pair = AccessToken.for_user(ExistingUser)

        accessToken = str(token_pair)

        headers = {'Authorization': f'Bearer {accessToken}'}

        profile_data = {

            'name': 'ExampleEdit',
            'bio': 'Changing bio'
        }

        url = 'http://127.0.0.1:8000/api/update-profile/'

        response = self.client.put(url, profile_data, content_type = 'application/json', HTTP_AUTHORIZATION=headers['Authorization'])

        self.assertEqual(response.status_code, status.HTTP_200_OK)
    #Tries to change profile information
    

    def test_WriteComment(self):

        ExistingUser = API.models.User.objects.create_user(
            email='ExamplerUser@gmail.com',
            username='ExamplerUser',
            password='ExamplerUser123'
        )

        token_pair = AccessToken.for_user(ExistingUser)
        accessToken = str(token_pair)
        headers = {'Authorization': f'Bearer {accessToken}'}

        ExistingPost = API.models.Advert.objects.create(
            AdTitle='Existing Advert',
            AdDesc='Existing Advert',
            AdPay=30,
            AdOwner=ExistingUser
        )

        comment_data = {
            'UserComment': 'Testing Comment',
            'CommentOwner': 'ExamplerUser',
        }

        url = f'http://127.0.0.1:8000/api/create-comment/{ExistingPost.id}/'

        response = self.client.post(url, comment_data, content_type='application/json', HTTP_AUTHORIZATION=headers['Authorization'])

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        #Attempts to write a comment on an advert

    def test_CommentWrongAdvert(self):

        ExistingUser = API.models.User.objects.create_user(
            email='ExamplerUser@gmail.com',
            username='ExamplerUser',
            password='ExamplerUser123'
        )

        token_pair = AccessToken.for_user(ExistingUser)
        accessToken = str(token_pair)
        headers = {'Authorization': f'Bearer {accessToken}'}

        comment_data = {
            'UserComment': 'Testing Comment',
            'CommentOwner': 'ExamplerUser',
        }

        url = f'http://127.0.0.1:8000/api/create-comment/9999/'

        response = self.client.post(url, comment_data, content_type='application/json', HTTP_AUTHORIZATION=headers['Authorization'])

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    #Comments on a non-existant advert

    def test_UnauthorizedComment(self):

        ExistingUser = API.models.User.objects.create_user(
            email='ExamplerUser@gmail.com',
            username='ExamplerUser',
            password='ExamplerUser123'
        )

        token_pair = AccessToken.for_user(ExistingUser)
        accessToken = str(token_pair)

        ExistingPost = API.models.Advert.objects.create(
            AdTitle='Existing Advert',
            AdDesc='Existing Advert',
            AdPay=30,
            AdOwner=ExistingUser
        )

        comment_data = {
            'UserComment': 'Testing Comment',
            'CommentOwner': 'ExamplerUser',
        }

        url = f'http://127.0.0.1:8000/api/create-comment/{ExistingPost.id}/'

        response = self.client.post(url, comment_data, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    #Tries to post a comment as a non logged in user

    def test_GetAllComments(self):

        ExistingUser = API.models.User.objects.create_user(
            email = 'ExistingUser@gmail.com',
            username = 'ExistingUser',
            password = 'ExistingFreelance123'
        )

        ExistingPost = API.models.Advert.objects.create(
            AdTitle='Existing Advert',
            AdDesc='Existing Advert',
            AdPay=30,
            AdOwner=ExistingUser
        )

        self.comment1 = API.models.Comment.objects.create(
            UserComment='Testing Comment',
            CommentOwner=ExistingUser,
            CommentOwnerEmail=ExistingUser.email,
            CommentedAdvert=ExistingPost
        )
                
        self.comment2 = API.models.Comment.objects.create(
            UserComment='Testing Comment 2',
            CommentOwner=ExistingUser,
            CommentOwnerEmail=ExistingUser.email,
            CommentedAdvert=ExistingPost
        )

        self.comment3 = API.models.Comment.objects.create(
            UserComment='Testing Comment 3',
            CommentOwner=ExistingUser,
            CommentOwnerEmail=ExistingUser.email,
            CommentedAdvert=ExistingPost
        )

        url = 'http://127.0.0.1:8000/api/get-comments/'

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    #Gets all comments saved on system

    def test_SendingEmail(self):

        ExistingUser = API.models.User.objects.create_user(
            email = 'ExistingUser@gmail.com',
            username = 'ExistingUser',
            password = 'ExistingFreelance123'
        )

        token_pair = AccessToken.for_user(ExistingUser)

        accessToken = str(token_pair)

        headers = {'Authorization': f'Bearer {accessToken}'}

        data = {
            'subject': 'Test Subject',
            'message': 'Test Message',
            'recipient': 'recipient@example.com'
        }

        json_data = json.dumps(data)

        url = 'http://127.0.0.1:8000/api/send-mail/'

        response = self.client.post(url, json_data, content_type='application/json', HTTP_AUTHORIZATION=headers['Authorization'])

        self.assertEqual(response.status_code, status.HTTP_200_OK)
    #Attempts to send an email 

    def test_UnathorizedEmail(self):

        data = {
            'subject': 'Test Subject',
            'message': 'Test Message',
            'recipient': 'recipient@example.com'
        }

        json_data = json.dumps(data)

        url = 'http://127.0.0.1:8000/api/send-mail/'

        response = self.client.post(url, json_data, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    #Tries to send email as a non logged in user

    def test_AddDeadline(self):

        ExistingUser = API.models.User.objects.create_user(
            email = 'ExistingUser@gmail.com',
            username = 'ExistingUser',
            password = 'ExistingFreelance123'
        )

        token_pair = AccessToken.for_user(ExistingUser)

        accessToken = str(token_pair)

        headers = {'Authorization': f'Bearer {accessToken}'}

        data = {

            'ProjectTitle': 'Test Deadline',
            'StartDate': '2024-04-20',
            'EndDate': '2023-04-29',
            'ProjectOwner': ExistingUser.id
        }

        url = 'http://127.0.0.1:8000/api/add-deadline/'

        response = self.client.post(url, data, content_type='application/json', HTTP_AUTHORIZATION = headers['Authorization'])

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #Adds a deadline associated to user

    def test_DeleteDeadline(self):

        ExistingUser = API.models.User.objects.create_user(
            email = 'ExistingUser@gmail.com',
            username = 'ExistingUser',
            password = 'ExistingFreelance123'
        )

        token_pair = AccessToken.for_user(ExistingUser)

        accessToken = str(token_pair)

        headers = {'Authorization': f'Bearer {accessToken}'}

        ExistingDeadline = API.models.Deadlines.objects.create(

            ProjectTitle = 'Test Deadline',
            StartDate = '2024-04-20',
            EndDate = '2023-04-29',
            ProjectOwner = ExistingUser
        )

        url = f'http://127.0.0.1:8000/api/delete-deadline/{ExistingDeadline.id}/'

        response = self.client.delete(url, HTTP_AUTHORIZATION = headers['Authorization'])

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        #Tries to delete the deadine from system

    def test_UnauthorizedDeleteDeadline(self):

        DeadlineOwner = API.models.User.objects.create_user(
            email = 'DeadlineOwner@gmail.com',
            username = 'DeadlineOwner',
            password = 'DeadlineOwner123'
        )

        LoggedUser = API.models.User.objects.create_user(
            email = 'ExistingUser@gmail.com',
            username = 'ExistingUser',
            password = 'ExistingFreelance123'
        )

        token_pair = AccessToken.for_user(LoggedUser)

        accessToken = str(token_pair)

        headers = {'Authorization': f'Bearer {accessToken}'}

        ExistingDeadline = API.models.Deadlines.objects.create(

            ProjectTitle = 'Test Deadline 2',
            StartDate = '2024-04-20',
            EndDate = '2023-04-29',
            ProjectOwner = DeadlineOwner
        )

        url = f'http://127.0.0.1:8000/api/delete-deadline/{ExistingDeadline.id}/'

        response = self.client.delete(url, HTTP_AUTHORIZATION = headers['Authorization'])

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    #Unauthorized user tries to delete a deadline
    

    def test_GetAllDeadlines(self):

        ExistingUser = API.models.User.objects.create_user(
            email = 'ExistingUser@gmail.com',
            username = 'ExistingUser',
            password = 'ExistingFreelance123'
        )

        token_pair = AccessToken.for_user(ExistingUser)

        accessToken = str(token_pair)

        headers = {'Authorization': f'Bearer {accessToken}'}


        ExistingDeadline = API.models.Deadlines.objects.create(

            ProjectTitle = 'Test Deadline 2',
            StartDate = '2024-04-20',
            EndDate = '2023-04-29',
            ProjectOwner = ExistingUser
        )

        
        ExistingDeadline2 = API.models.Deadlines.objects.create(

            ProjectTitle = 'Test Deadline 2',
            StartDate = '2024-04-20',
            EndDate = '2023-04-29',
            ProjectOwner = ExistingUser
        )

        
        ExistingDeadline3 = API.models.Deadlines.objects.create(

            ProjectTitle = 'Test Deadline 3',
            StartDate = '2024-04-20',
            EndDate = '2023-04-29',
            ProjectOwner = ExistingUser
        )

        url = 'http://127.0.0.1:8000/api/all-deadlines/'

        response = self.client.get(url,  HTTP_AUTHORIZATION=headers['Authorization'])

        self.assertEqual(len(response.data), 3)
    #Retrieves all deadlines saved on database