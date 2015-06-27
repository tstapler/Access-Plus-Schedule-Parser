# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('course_name', models.CharField(max_length=30)),
                ('course_number', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='MeetingTime',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('days', models.CharField(max_length=2, choices=[('MO', 'Monday'), ('TU', 'Tuesday'), ('WE', 'WEDNESDAY'), ('TH', 'Thursday'), ('FR', 'Friday'), ('SA', 'Saturday')])),
                ('time', models.DateField()),
                ('instructor', models.CharField(max_length=30)),
                ('location', models.CharField(max_length=30)),
                ('course', models.ForeignKey(to='ScheduleViewer.Course')),
            ],
        ),
        migrations.CreateModel(
            name='Schedule',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('semester', models.CharField(max_length=2, choices=[('fall', 'Fall'), ('spring', 'Spring'), ('summer', 'Summer')], default='fall')),
                ('year', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('email', models.EmailField(max_length=254)),
            ],
        ),
        migrations.AddField(
            model_name='schedule',
            name='student',
            field=models.ForeignKey(to='ScheduleViewer.Student'),
        ),
        migrations.AddField(
            model_name='course',
            name='schedule',
            field=models.ForeignKey(to='ScheduleViewer.Schedule'),
        ),
    ]
