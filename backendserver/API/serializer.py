import API.models
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
#Import the necessary libraries
#Serializers facilitate the conversion of complex data into python data types e.g. JSON and vice versa


#Meta class are for specifying the metadata passed to serializer
class UserSerializer(serializers.ModelSerializer):

    class Meta:

        model = API.models.User
        #Model to be serialized

        fields = ('id', 'username', 'email')
        #Specifies what fields to include in serializer

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = API.models.Profile

        fields = ['name', 'bio']

class AdvertSerialzier(serializers.ModelSerializer):

    adOwner_name = serializers.CharField(source = "AdOwner.name", read_only = True)
    #Custom field name made and passed to serializer for advert owner name

    class Meta:

        model = API.models.Advert

        fields = ['id', 'AdTitle', 'AdDesc', 'AdPay', 'AdDate', 'adOwner_name']

class TagSerializer(serializers.ModelSerializer):

    class Meta:

        model = API.models.Tag

        fields = ['id', 'TagName']

class CommentSerializer(serializers.ModelSerializer):

    class Meta:

        model = API.models.Comment

        fields = ['id', 'UserComment', 'CommentTime', 'CommentedAdvert', 'CommentOwner', 'CommentOwnerEmail']

class DeadlineSerializer(serializers.ModelSerializer):

    class Meta:

        model = API.models.Deadlines

        fields = ['id', 'ProjectTitle', 'StartDate', 'EndDate', 'ProjectOwner']

    
class Token(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):

        token = super().get_token(user)
        #Gets the JWT token made for the user and adds extra information to it e.g. name, email, bio etc and returns the token

        token['name'] = user.profile.name

        token['username'] = user.username

        token['email'] = user.email
        
        token['bio'] = user.profile.bio

        token['verified'] = user.profile.verified  

        return token

class RegisterSeri(serializers.ModelSerializer):

    password = serializers.CharField(

        write_only=True, required=True, validators=[validate_password]

    )

    #Validates the inputted password against django built in library

    passwordtwo = serializers.CharField(

        write_only=True, required=True

    )

    class Meta:

        model = API.models.User

        fields = ['email', 'username', 'password', 'passwordtwo']


    def val(self, attrs):

        if attrs['password'] != attrs['passwordtwo']:

            raise serializers.ValidationError({"password": "Passwords do not match!"})
        
        return attrs
    
    #Validates the 2 passwords and checks if they match

    def create(self, validated_data):

        validated_data.pop('passwordtwo')

        user = API.models.User.objects.create_user(**validated_data)

        user.save()

        return user
    
    #From passed data to create user the passwordtwo field is popped, and using user model new user in made in the system.