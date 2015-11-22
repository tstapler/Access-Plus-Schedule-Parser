from django.db import models
from django.utils import timezone
# Create your models here.

class Student(models.Model):
    first_name = models.CharField(max_length=30, default='John')
    last_name = models.CharField(max_length=30, default='Doe')
    email = models.EmailField()

    def __str__(self):
        return self.first_name + " " + self.last_name

class Schedule(models.Model):
    student = models.ForeignKey(Student)
    SEMESTERS = (
            ('fall', 'Fall'),
            ('spring', 'Spring'),
            ('summer', 'Summer'),
            )
    semester = models.CharField(max_length=6, choices=SEMESTERS, default='fall')
    year = models.DateTimeField(default=timezone.now)
    schedule_html = models.FileField(null=True)

    def __str__(self):
        return self.student.first_name + "'s " + self.semester + " schedule"

class Course(models.Model):
    schedule = models.ManyToManyField(Schedule)
    course_name = models.CharField(max_length=30, default='Default Course')
    course_number = models.CharField(max_length=30, default='College 101')
    section_id = models.CharField(max_length=2, default='X')
    ref_number = models.CharField(max_length=10, default='50000')
    CREDITS = (
                (1, "One"),
                (2, "Two"),
                (3, "Three"),
                (4, "Four"),
                (5, "Five"),
                (6, "Six"),
            )
    credits = models.IntegerField(choices=CREDITS, default=3)
    notes = models.TextField(default='None')
    requirements = models.TextField(default='None')
    drop_date = models.DateField(default=timezone.now)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(default=timezone.now)


    def __str__(self):
        return self.course_number + ": " + self.course_name

class MeetingTime(models.Model):
    course = models.ForeignKey(Course)
    DAYS = (
            ('MO', "M"),
            ('TU', "T"),
            ('WE', "W"),
            ('TH', "T"),
            ('FR', "F"),
            ('SA', "S"),
            )
    days =  models.CharField(max_length=2, choices=DAYS)
    start_time = models.TimeField(default='8:10')
    end_time = models.TimeField(default='9:00')
    instructor = models.CharField(max_length=30, default-"N\A")
    location = models.CharField(max_length=30, default="N\A")

    def __str__(self):
        return self.course.course_number + " with " + self.instructor + " on " + self.days
