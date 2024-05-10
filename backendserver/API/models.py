from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.utils import timezone
#Importing necessary libraries

class User(AbstractUser):

    username = models.CharField(max_length=100)

    email = models.EmailField(unique = True)

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['username']


    def get_profile(self):

        return self.profile
    
#Specifying user model and its fields, required to have username
    
class Profile(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    name = models.CharField(max_length=70)
    
    bio = models.CharField(max_length=400, default='')
    
    verified = models.BooleanField(default=False)

    def __str__(self):

        return self.name

    def save(self, *args, **kwargs):

        if not self.bio: 

            self.bio = f'Hey {self.name} here! Looking forward to working with you, please send me an email if you want to get in touch!'

        super().save(*args, **kwargs)

#Specifying profile model and automatically assigning all profiles with a bio so none are left empty


class Deadlines(models.Model):

    ProjectTitle = models.CharField(max_length = 150)

    StartDate = models.DateField()

    EndDate = models.DateField()

    ProjectOwner = models.ForeignKey(User, on_delete = models.CASCADE)

#Deadline model to save the information in, project owner field is automatically assigned to user posting it
    
class Tag(models.Model):

    TagName = models.CharField(max_length = 50)

    def __str__(self):
        
        return self.TagName
    
#Tag model to save advert tags in
    

class Advert(models.Model):

    AdTitle = models.CharField(max_length = 150)

    AdDesc = models.TextField()

    AdPay = models.DecimalField(max_digits = 13, decimal_places = 2)

    AdOwner = models.ForeignKey(User, on_delete = models.CASCADE, default = 1)

    AdDate = models.DateTimeField(auto_now_add = True)

    AdTags = models.ManyToManyField('Tag', related_name = 'adverts')

    def __str__(self):

        return self.AdTitle
    
#Advert model with adowner and tag relations, one to one relation with owner as only 1 user can own advert
    

class Comment(models.Model):

    UserComment = models.TextField()

    CommentTime = models.DateTimeField(default = timezone.now)

    CommentedAdvert = models.ForeignKey('Advert', on_delete = models.CASCADE, related_name = 'comments')

    CommentOwner = models.CharField(max_length=150)

    CommentOwnerEmail = models.EmailField(max_length=150, default = None)

#Comment model 



def create_profile(sender, instance, created, **kwargs):

    if created:

        profile = Profile.objects.create(user = instance, name = instance.username)


def save_profile(sender, instance, **kwargs):

    instance.profile.save()  

#Create/Save profile object associated with User whenever created/edited

post_save.connect(create_profile, sender = User)
post_save.connect(save_profile, sender = User)