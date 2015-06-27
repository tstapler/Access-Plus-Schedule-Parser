from django.db import models

# Create your models here.

class Student(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
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
    year = models.DateTimeField()
    schedule_html = models.FileField(null=True)

    def __str__(self):
        return self.student.first_name + "'s " + self.semester + " schedule"

class Course(models.Model):
    schedule = models.ManyToManyField(Schedule)
    course_name = models.CharField(max_length=30)
    course_number = models.CharField(max_length=30)
    section_id = models.CharField(max_length=2, default='X')
    ref_number = models.CharField(max_length=10)
    CREDITS = (
                (1, "One"),
                (2, "Two"),
                (3, "Three"),
                (4, "Four"),
                (5, "Five"),
                (6, "Six"),
            )
    credits = models.IntegerField(choices=CREDITS)
    notes = models.TextField()
    requirements = models.TextField()
    drop_date = models.DateField()
    start_date = models.DateField()
    end_date = models.DateField()


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
    days =  models.CharField(max_length=10)
    start_time = TimeField()
    end_time = TimeField()
    instructor = models.CharField(max_length=30)
    location = models.CharField(max_length=30)

    def __str__(self):
        return self.course.course_number + " with " + self.instructor + " on " + self.days


