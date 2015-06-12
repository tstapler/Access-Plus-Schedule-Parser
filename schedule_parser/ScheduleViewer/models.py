from django.db import models

# Create your models here.

class Schedule(models.Model):
    courses = models.ForeignKeys(Course)
    student = models.ForeignKey(Student)
    semester = models.CharField()
    year = models.IntField()

class Course(models.Model):
    course_name = models.CharField()
    course_number = models.CharField()

class MeetingTime(models.Model):
    course = models.ForeignKey(Course)
    days =  models.CharField()
    time = models.DateField()
    instructor = models.CharField()
    location = models.CharField()

class Student(models.Model):
    first_name = models.CharField()
    last_name = models.CharField()
    email = models.Email()
    schedule = models.ForeignKey(Schedule)

