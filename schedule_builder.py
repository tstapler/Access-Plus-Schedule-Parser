from bs4 import BeautifulSoup
import re
from icalendar import Calendar, Event, vRecur, vWeekday, vDatetime, vText
import time
from time import mktime
from datetime import datetime
import pytz
from tzlocal import get_localzone

#TODO: Handle Command Line Arguments for the html file
class ScheduleParser():
    #TODO: Write doc string
    def __init__(self):
        self.step_numb = 0  # Current Step
        self.class_numb = 0  # Current Class
        self.curr_string = ""
        self.courses = []
        self.fields = {
            "section": "",
            "course_name": "",
            "credits": "",
            "drop_date": "",
            "ref_numb": "",
            "notes": "",
            "recs": "",
            "meeting_dates": "",
            "days": list(),
            "start_times": list(),
            "end_times": list(),
            "location": list(),
            "instructor": list()
        }
        #TODO: Change to dictionary for more maintainable code
        self.field_patterns = [
            re.compile('section *(.*)'),
            re.compile('(\d\.\d)'),
            re.compile('^(\d\d/\d\d/\d\d)-(\d\d/\d\d/\d\d)'),
            re.compile(r'\b[MTWRF]\b'),
            re.compile('\d\d:\d\d \s*'),
            re.compile('.*(\d\d/\d\d/\d\d\d\d).*')
        ]

    def __str__(self):
        return str(self.courses)

    def reset_fields(self):
        #TODO: Write doc string
        #TODO: Handle the lists properly
        for field in self.fields:
            self.fields[field] = ""

    def set_curr_string(self, string):
        #TODO: Write doc string
        self.curr_string = string.strip().replace('\xa0', '')

    def add_value_to_field_list(self, field, value):
        #TODO: Write doc string
        if (self.fields[field] == ""):
            self.fields[field] = [value]
        else:
            self.fields.setdefault(field, list()).append(value)

    #TODO: Add addtional fields for all needed data
    #TODO: Check if it's possible to find the textbook info
    def parse(self):
        """
        Move throughout the state machine.
        """
        if self.step_numb == 0:
            self.set_course_numb()

        elif self.step_numb == 1:
            self.set_section_id()

        elif self.step_numb == 2:
            self.set_course_name()

        elif self.step_numb == 3:
            self.set_numb_credits()

        elif self.step_numb == 4:
            self.set_drop_date()

        elif self.step_numb == 5:
            self.set_reference_numb()

        elif self.step_numb == 6:
            self.set_requirements()

        elif self.step_numb == 7:
            self.set_notes()

        elif self.step_numb == 8:
            self.set_meeting_dates()

        elif self.step_numb == 9:
            self.skip_headers()

        elif self.step_numb == 10:
            self.set_meeting_days()

        elif self.step_numb == 11:
            self.set_meeting_times()

        elif self.step_numb == 12:
            self.set_meeting_times()

        elif self.step_numb == 13:
            self.set_location()

        elif self.step_numb == 14:
            self.set_instructor()

    @staticmethod
    def strip_all_tags(html):
        #TODO: Write doc string
        if html is None:
            return None
        return ''.join(BeautifulSoup(html).findAll(text=True))

    def set_course_numb(self):
        #TODO Write doc string
        self.fields["course_numb"] = self.curr_string
        self.step_numb += 1

    def set_section_id(self):
        """
        Grab the section id out of the string
        :return: return just the identifier
        """
        # Return the Section identifier
        results = re.match(self.field_patterns[0], self.curr_string)
        if results:
            self.fields["section"] = results.group(1)
            self.step_numb += 1

    def set_course_name(self):
        """
        Return the name of the course
        :return:The name of the course is
        """
        self.fields["course_name"] = self.curr_string
        self.step_numb += 1

    def set_numb_credits(self):
        """
        Grab the number of credits the course is
        :return:
        """
        results = re.match(self.field_patterns[1], self.curr_string)
        if (results):
            self.fields["credits"] = results.group(1)
        elif "Credits" in self.curr_string:
            self.step_numb += 1

    def set_drop_date(self):
        #TODO: Write doc string
        results = re.match(self.field_patterns[5], self.curr_string)
        if results:
            self.fields["drop_date"] = results.group(1)
            self.step_numb += 1

    def set_reference_numb(self):
        #TODO: Write doc string
        if "Reference #:" in self.curr_string:
            return
        else:
            self.fields["ref_numb"] = self.curr_string
            self.step_numb += 1

    def set_requirements(self):
        #TODO: Write doc string
        if "Prerequisites:" in self.curr_string:
            return
        elif "Notes:" in self.curr_string:
            self.step_numb += 1
        else:
            self.fields["recs"] += self.curr_string

    def set_notes(self):
        #TODO: Write doc string
        if "Meeting Dates:" in self.curr_string:
            self.step_numb += 1
        else:
            self.fields["notes"] += self.curr_string

    def set_meeting_dates(self):
        #TODO: Write doc string
        results = re.match(self.field_patterns[2], self.curr_string)
        self.fields["meeting_dates"] = (results.group(1), results.group(2))
        self.step_numb += 1

    def skip_headers(self):
        #TODO: Write doc string
        if "Instructor" in self.curr_string:
            self.step_numb += 1

    def set_meeting_days(self):
        """
        Check for the four possible cases:
        1. This class is arranged so no meetings

        2. There is another meeting to process

        3. There are no more meeting to process
        """
        results = re.findall(self.field_patterns[3], self.curr_string)
        section = re.match(self.field_patterns[0], self.curr_string)
        if self.curr_string == "ARR.":  # If this class has no meeting dates this is the end of the state machine loop
            self.step_numb = 14
        elif results: # Normal class with days listed, proceed to the next state
            days = ""
            self.step_numb += 1
            for result in results:
                days += result
            self.add_value_to_field_list("days", " ".join(days))
        else:
            self.finish_current_course()
            self.step_numb = 0
            self.set_course_numb()

    def set_meeting_times(self):
        """
        There will be two times, start and end times for each course meeting
        """
        results = re.match(self.field_patterns[4], self.curr_string)
        if results:
            if self.step_numb == 11:
                self.add_value_to_field_list("start_times", self.curr_string)
            elif self.step_numb == 12:
                self.add_value_to_field_list("end_times", self.curr_string)
            self.step_numb += 1

    def set_location(self):
        """
        Location Is Easy, Just add append the string and check for another meeting day
        """
        self.add_value_to_field_list("location", self.curr_string)
        self.step_numb += 1  # Return to days because there may be a second meeting time

    def set_instructor(self):
        #TODO: Write doc string
        self.add_value_to_field_list("instructor", self.curr_string)
        self.step_numb = 10

    def finish_current_course(self):
        """
        Finalize the current course by adding it to the
        course listing and resetting all of the local state variables.
        """
        current_course = self.make_new_course()
        self.courses.append(current_course)
        self.class_numb += 1
        self.step_numb = 0
        self.reset_fields()


    def make_new_course(self):
        """
        Return a properly constructed Course() object initialized from all of the parser's current fields.
        """
        return Course(self.fields["course_numb"], self.fields["course_name"], self.fields["section"], self.fields["credits"],
                      self.fields["recs"], self.fields["meeting_dates"], self.fields["days"], self.fields["start_times"],
                      self.fields["end_times"], self.fields["location"], self.fields["instructor"])

class Course:
    """
    This class serves simply as a convenient data structure for holding the data generated by the parser
    and converting it to other forms
    """
    def __init__(self, number, name, section, class_credits, recs, meeting_dates, days, start_times, end_times, locations, instructors):
        self.number = number
        self.name = name
        self.section = section
        self.class_credits = class_credits
        self.recs = recs
        self.meeting_dates = meeting_dates
        self.days = days
        self.start_times = start_times
        self.end_times = end_times
        self.locations = locations
        self.instructors = instructors
        self.meeting_times = list()

        for location, instructor, start_time, end_time, day in zip(locations, instructors, start_times, end_times, days):
            self.meeting_times.append(MeetingTime(instructor, location, start_time, end_time, day, meeting_dates))

    def __str__(self):
        """
        Print a pleasant looking string for the Course object
        :return:
        """
        return self.number + ": " + self.name + ", section " + self.section + ", a " + self.class_credits + " credit class. \n" \
            "This class meets in " + " and ".join(self.locations) + " on " + " and ".join(self.days)       \
            + " starting at " + " or ".join(self.start_times) + " and ending at " + " or ".join(self.end_times) +"\n" \
            + "from " + self.meeting_dates[0] + " to " + self.meeting_dates[1] + ". The Instructor(s) for the meetings are: " \
            + " and ".join(self.instructors)

class MeetingTime():
    #TODO: Write Doc String
    def __init__(self, instructor, location, start_time, end_time, days, meeting_dates):
        self.instructor = instructor
        self.location = location
        self.start_time = start_time
        self.end_time = end_time
        self.days = days
        self.meeting_dates = meeting_dates
        self.start_in_datetime, self.end_in_datetime,self.repeat_until = self.time_struct_to_datetime()
        self.days_to_ics()

    def days_to_ics(self):
        """
        Convert the days the class meets from M, T, W, R, F to MO, TU, WE, TH, FR
        Return the converted strings to
        :return:
        """
        self.days = self.days.replace("M", "MO")
        self.days = self.days.replace("T", "TU")
        self.days = self.days.replace("W", "WE")
        self.days = self.days.replace("R", "TH")
        self.days = self.days.replace("F", "FR")

    def time_struct_to_datetime(self):
        """
        Convert all of the parsed times into datetimes so they can be easily added
        :return: a start time and end time datetime objects
        """
        tz = get_localzone()
        ics_start = self.build_datetime(self.start_time, self.meeting_dates[0])
        ics_end = self.build_datetime(self.end_time, self.meeting_dates[0])
        ics_repeat_until = self.build_datetime(self.end_time,self.meeting_dates[1])
        ics_start = datetime.fromtimestamp(mktime(ics_start))
        ics_end = datetime.fromtimestamp(mktime(ics_end))
        ics_repeat_until = datetime.fromtimestamp(mktime(ics_repeat_until))
        return ics_start.replace(tzinfo=tz), ics_end.replace(tzinfo=tz), ics_repeat_until.replace(tzinfo=tz)

    def build_datetime(self, in_time, in_date):
        """
        Make a datetime from the various strings that we were able to parse
        :param in_time: a meeting time string(s) for converting
        :param in_date: the date to append to the time
        :return: return the completed datetime object
        """
        # Append an M to the end of each string to make A and P into AM or PM respectively
        ics_start =  in_time + "M"
        # Append the Date to the time string
        ics_start = ics_start + " " + in_date
        # Parse the string to pull out the relevant time data into an object
        return time.strptime(ics_start, "%I:%M %p %x")


    def datetime_to_string(self, datetime):
        """
        Method which returns a time in string form properly formatted for .ics
        :param datetime: a time object
        :return: properly formatted string
        """
        return datetime.isoformat()

    def __str__(self):
        return "This meeting is taught by " + self.instructor + " in " + self.location + " from " + self.start_time \
                + " to " + self.end_time + " on " + self.days


class IcsGenerator():
    """
    Generates the .ics file which can then be fed into iCalendar, Google Calendar, Microsoft Outlook and various other
    supporters of the open source .ics specification.
    """
    def __init__(self, target_parser):
        """
        Initialize the IcsGenerator with an object to generate from.
        :param target_parser: The parser the user intends to extract ics data from.
        """
        self.target_parser = target_parser
        self.ics_calendar = Calendar()
        self.ics_calendar.add('prodid','-//My calendar//mxm.dk//')
        self.ics_calendar.add('version','2.0')
        self.add_courses_to_calendar()

    @staticmethod
    def create_course(course, meeting):
        """
        Create a new iCalendar Event to be created
        :param course: the ''Course()'' object that needs to be changed into ics format
        :return: an Event object initialized with the course's data
        """
        event = Event()
        event['summary'] = vText(course.number + ": " + course.name)
        #event['description'] = vText(course.recs) <-- Currently Giving strange output
        event['location'] = vText(meeting.location)
        #TODO: Find the timezone based on the computer and add it to the datetimeobject
        event.add('dtstart', meeting.start_in_datetime)
        event.add('dtend', meeting.end_in_datetime)
        byday_list = list()
        for day in meeting.days.split():
            byday_list.append(vWeekday(day))
        event.add('rrule',{'freq': 'WEEKLY', 'byday':byday_list, 'until': meeting.repeat_until})

        return event

    def add_courses_to_calendar(self):
        for course in self.target_parser.courses:
            for meeting in course.meeting_times:
                self.ics_calendar.add_component(self.create_course(course, meeting))

    def export_to_ics(self):
        with open("class_schedule.ics", "w") as file:
            file.write(self.ics_calendar.to_ical().decode('utf-8'))

    def pprint_calendar(self):
        return self.ics_calendar.to_ical().replace('\r\n', '\n')


if __name__ == "__main__":

    with open("sarahs_schedule.html") as schedule:
        soup = BeautifulSoup(schedule)
        parser = ScheduleParser()
        soup.encode('utf-8', 'ignore')

        printing = False
        count = 0
        details = 0
        #TODO: Pull this functionality into the ScheduleParser class
        for span in soup.find_all("td"):

            span_text = ScheduleParser.strip_all_tags(span.get_text(strip=True))
            parser.set_curr_string(span_text)
            if "Schedule Details" in span_text:
                details += 1
            if "View Complete Textbook List" in span_text:
                if count >= 1 and details == 5:
                    printing = True
                count += 1
            elif "FOOTER" in span_text and printing:
                printing = False
            elif "%=" in span_text and printing:
                continue
            elif span_text != "" and printing:
                if(span_text.strip() != ""):
                    parser.parse()
                    print(span_text.strip())

        print("\nCourse Schedule:\n")
        for course in parser.courses:
            print(str(course) + "\n")
            print("There are " + str(len(course.meeting_times)) + " meeting times.\n" )
            for time in course.meeting_times:
                print(time)


        ics = IcsGenerator(parser)
        ics.export_to_ics()
