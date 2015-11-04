from django.contrib import admin

from .models import Student, Schedule, Course, MeetingTime


# Register your models here.

admin.site.register(Student)
admin.site.register(Schedule)
admin.site.register(Course)
admin.site.register(MeetingTime)
