from django.contrib import admin
import API.models
#Importing libraries
#This file is dedicated towards the Django admin interace, shows all fields to be displayed in admin interfac and which one can be editable.


class Admin(admin.ModelAdmin):

    list_display = ['id', 'username', 'email']

class AdminProfile(admin.ModelAdmin):

    list_display = ['user', 'name', 'verified']

    list_editable = ['verified', 'name']

    
class AdminAdvert(admin.ModelAdmin):

    list_display = ['id', 'AdTitle', 'AdDesc', 'AdPay', 'AdOwner', 'AdDate']

    list_filter = ['AdDate']

    search_fields = ['AdTitle', 'AdOwner__email']

class AdminComments(admin.ModelAdmin):

    list_display = ['id', 'UserComment', 'CommentTime', 'CommentedAdvert', 'CommentOwner', 'CommentOwnerEmail']

class AdminDeadline(admin.ModelAdmin):

    list_display = ['id', 'ProjectTitle', 'StartDate', 'EndDate', 'ProjectOwner']

    

admin.site.register(API.models.User, Admin)
admin.site.register(API.models.Profile, AdminProfile)
admin.site.register(API.models.Tag)
admin.site.register(API.models.Advert, AdminAdvert)
admin.site.register(API.models.Comment, AdminComments)
admin.site.register(API.models.Deadlines, AdminDeadline)

#Registering the models to the admin page
