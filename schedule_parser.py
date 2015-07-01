from bs4 import BeautifulSoup
import re
from icalendar import Calendar, Event, vRecur, vWeekday, vDatetime, vText
import time
from time import mktime
from datetime import datetime as dt
import pytz
from tzlocal import get_localzone
import click

#TODO: Handle Command Line Arguments for the html file
class ScheduleParser():
    """
    Parses the HTML of accessplus for schedule details
    """
    def __init__(self, debug=False):
        self.debug = debug
        self.step_numb = 0
        self.class_numb = 0
        self.curr_string = ""
        self.courses = []
        self.fields = {
            "course_numb": "",
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
        self.field_patterns = {
                "numb_section_name_credits" : re.compile('(.* \d\d\d\w?)section (\w)(.*)(\d\.\d)'),
                "course_numb" : re.compile('.* \d\d\d'),
                "section" : re.compile('section ?(\d?\d?\w)'),
                "credits" : re.compile('.*(\d\.\d)'),
                "meeting_dates" : re.compile('^(\d\d/\d\d/\d\d)-(\d\d/\d\d/\d\d)'),
                "days" : re.compile(r'\b[MTWRFS]\b'),
                "time" : re.compile('\d\d:\d\d [AP]'),
                "date": re.compile('.*(\d\d/\d\d/\d\d\d\d).*')

                }

    def __str__(self):
        return str(self.courses)

    def reset_fields(self):
        """
        Clear the fields in the fields dictionary
        """
        for field in self.fields:
            if isinstance(field, list):
                self.fields[field] = list()
            else:
                self.fields[field] = ""

    def clear(self):
        """
        Clear the parser in preparation for another schedule
        """
        self.courses = []
        self.step_numb = 0
        self.class_numb = 0
        self.reset_fields()

    def set_curr_string(self, string):
        """
        Set the string that will be operated on
        """
        self.curr_string = string.replace('\xa0', '').replace('\n', '').strip()

    def add_to_field_list(self, field, value):
        """
        Enable to the ability to add to an empty list
        """
        if type(self.fields[field]) is list:
            self.fields[field].append(value)
        else:
            if self.fields[field] == "":
                self.fields[field] = [ value ]

    def parse(self):
        """
        Move throughout the state machine.
        """
        if self.debug:
            print(self.step_numb)

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
        """
        Grab all the plain text from an HTML document
        """
        if html is None:
            return None
        return ''.join(BeautifulSoup(html).findAll(text=True))

    def set_course_numb(self):
        """
        Step 0:
        Grab the course numb
        EG: School 101
        """
        results = re.match(self.field_patterns["numb_section_name_credits"], self.curr_string)

        if results:
            self.fields["course_numb"] = results.group(1)
            self.fields["section"]= results.group(2)
            self.fields["course_name"] = results.group(3).rstrip()
            self.fields["credits"] = results.group(4)
            self.step_numb = 4

        else:
            self.fields["course_numb"] = self.curr_string
            self.step_numb += 1

    def set_section_id(self):
        """
        Step 1:
        Grab the section id
        EG: section 1
        """
        # Return the Section identifier
        results = re.match(self.field_patterns["section"], self.curr_string)
        if results:
            self.fields["section"] = results.group(1)
            self.step_numb += 1

    def set_course_name(self):
        """
        Step 2:
        Return the name of the course
        EG: How to College
        """
        self.fields["course_name"] = self.curr_string
        self.step_numb += 1

    def set_numb_credits(self):
        """
        Step 3:
        Grab the number of credits the course is
        EG: 12.0
        """
        results = re.match(self.field_patterns["credits"], self.curr_string)
        if (results):
            self.fields["credits"] = results.group(1)
        elif "Credits" in self.curr_string:
            self.step_numb += 1

    def set_drop_date(self):
        """
        Step 4:
        Grab the last day you can drop the class
        EG: Last day to drop w/o extenuating circumstances: 11/08/2299
        """
        results = re.match(self.field_patterns["date"], self.curr_string)
        if results:
            self.fields["drop_date"] = results.group(1)
            self.step_numb += 1

    def set_reference_numb(self):
        """
        Step 5:
        Grab the reference number for this section of the course
        It is usually used for adding a specific section
        EG: 3356705
        """
        if "Reference #:" in self.curr_string:
            return
        else:
            self.fields["ref_numb"] = self.curr_string
            self.step_numb += 1

    def set_requirements(self):
        """
        Step 6:
        Grab the prerequisites for the class

        EG: H20 342 (Underwater Basketweaving)
        """
        if "Prerequisites:" in self.curr_string:
            return
        elif "Notes:" in self.curr_string:
            self.step_numb += 1
        elif "Meeting Dates:" in self.curr_string:
            self.step_numb = 8
        else:
            if self.fields["recs"] == "":
                self.fields["recs"] = self.curr_string
            else:
                self.fields["recs"] += " " + self.curr_string

    def set_notes(self):
        """
        Step 7:
        Grab any notes about the class

        EG: MOST SECTIONS OF THIS CLASS WILL NOT PASS
        """
        if "Meeting Dates:" in self.curr_string:
            self.step_numb += 1
        else:
            if self.fields["notes"] == "":
                self.fields["notes"] = self.curr_string
            else:
                self.fields["notes"] += " " + self.curr_string

    def set_meeting_dates(self):
        """
        Step 8:
        Grab the meeting dates for the class

        This is most important for classes which do not last the whole semester

        EG:08/24/15-12/18/15
        """
        results = re.match(self.field_patterns["meeting_dates"], self.curr_string)
        if results:
            self.fields["meeting_dates"] = (results.group(1), results.group(2))
            self.step_numb += 1
        else:
            return

    def skip_headers(self):
        """
        Step 9:
        Skip useless strings

        The parser generates some useless header strings, skip them
        """
        if "Instructor" in self.curr_string:
            self.step_numb += 1

    def set_meeting_days(self):
        """
        Step 10:
        Check for the four possible cases:
        1. This class is arranged so no meetings

        2. There is another meeting to process

        3. There are no more meeting to process
        """
        if self.curr_string == "MTWRF": #Special case for class that meets every day
            self.curr_string = " ".join(self.curr_string)
        results = re.findall(self.field_patterns["days"], self.curr_string)

        if self.curr_string == "ARR.":  # If this class has no meeting dates this is the end of the state machine loop
            self.step_numb = 14

        elif results: # Normal class with days listed, proceed to the next state
            days = ""
            self.step_numb += 1
            self.add_to_field_list("days", self.curr_string)

        else: #This is the start of a new course
            self.finish_current_course()
            self.set_course_numb()

    def set_meeting_times(self):
        """
        Step 11 & 12:
        There will be two times, start and end times for each course meeting
        """
        results = re.match(self.field_patterns["time"], self.curr_string)
        if results:
            if self.step_numb == 11:
                self.add_to_field_list("start_times", self.curr_string)
            elif self.step_numb == 12:
                self.add_to_field_list("end_times", self.curr_string)
            self.step_numb += 1

    def set_location(self):
        """
        Step 13:
        Location Is Easy, Just add append the string and check for another meeting day
        """
        new_course = re.match(self.field_patterns["numb_section_name_credits"], self.curr_string)
        another_meeting = re.match(self.field_patterns["days"], self.curr_string)
        if new_course:
            self.add_to_field_list("location", "Unknown")
            self.add_to_field_list("instructor", "Unknown")
            self.finish_current_course()
            self.set_course_numb()
        elif another_meeting:  #There is no location or instructor, this is another meeting time
            self.step_numb = 10
            self.add_to_field_list("location", "Unknown")
            self.add_to_field_list("instructor", "Unknown")
            self.set_meeting_days()
        else:
            self.add_to_field_list("location", self.curr_string) # Decide if we will use this function or a call to fields[]
            self.step_numb += 1

    def set_instructor(self):
        """
        Step 14:
        Set the course's Instructor
        """
        self.add_to_field_list("instructor", self.curr_string)
        self.step_numb = 10 # Return to step ten to see if there is another meeting

    def finish_current_course(self, current_course=None):
        """
        Finalize the current course by adding it to the
        course listing and resetting all of the local state variables.
        """
        if current_course is None:
            current_course = Course(self.fields["course_numb"], self.fields["course_name"], self.fields["section"], self.fields["credits"],
                          self.fields["recs"], self.fields["notes"], self.fields["meeting_dates"], self.fields["days"], self.fields["start_times"],
                          self.fields["end_times"], self.fields["location"], self.fields["instructor"])
        self.courses.append(current_course)
        self.class_numb += 1
        self.step_numb = 0
        self.reset_fields()

    #TODO: Check if it's possible to find the textbook info
    def parse_html(self, page_html):
        """
        Parse the html file passed into the function

        It should be the HTML file from the view schedule page of Access Plus
        """
        if ".html" not in page_html:
            page_html += ".html"
        with open(page_html, 'r') as schedule:
            soup = BeautifulSoup(schedule)


            flag = False
            count = 0
            details = 0
            for span in soup.find_all("td"):

                span_text = self.strip_all_tags(span.get_text(strip=True))
                self.set_curr_string(span_text)
                if "Schedule Details" in span_text:
                    details += 1
                if "View Complete Textbook List" in span_text:
                    if count >= 1 and details == 5:
                        flag = True
                    count += 1
                elif "FOOTER" in span_text and flag:
                    flag = False
                elif "%=" in span_text and flag:
                    continue
                elif span_text != "" and flag:
                    if(span_text.strip() != ""):
                        if self.debug:
                            print(self.curr_string)
                        self.parse()
            if self.step_numb != 0:
                if self.step_numb == 13:
                    self.add_to_field_list("location", "Unknown")
                    self.add_to_field_list("instructor", "Unknown")
                self.finish_current_course()

    def __str__(self):
        """
        Print the current class schedule in human readable format
        """
        string = ""
        string += "\nCourse Schedule:\n"
        for course in self.courses:
            string += str(course) + " "
            string += "There are " + str(len(course.meeting_times)) + " meeting times:" + "\n\n"
            for number, time in enumerate(course.meeting_times, start=1):
                string += "Number " + str(number) + ": " + str(time) + "\n\n"
        return string

class Course:
    """
    This class serves simply as a convenient data structure for holding the data generated by the parser
    and converting it to other forms
    """
    def __init__(self, number, name, section, class_credits, recs, notes, meeting_dates, days, start_times, end_times, locations, instructors):
        self.number = number
        self.name = name
        self.section = section
        self.class_credits = class_credits
        self.recs = recs
        self.notes = notes
        self.meeting_dates = meeting_dates
        self.days = days
        self.start_times = start_times
        self.end_times = end_times
        self.locations = locations
        self.instructors = instructors
        self.meeting_times = list()

        for location, instructor, start_time, end_time, day in zip(locations, instructors, start_times, end_times, days):
            self.meeting_times.append(MeetingTime(instructor, location, start_time, end_time, day, meeting_dates))

    #TODO: Add notes section to the str output
    def __str__(self):
        """
        Print a pleasant looking string for the Course object
        :return:
        """
        return self.number + ": " + self.name + ", section " + self.section + ", a " + self.class_credits + " credit class. \n\n" \
            "This class meets in " + " and ".join(self.locations) + " on " + " and ".join(self.days)       \
            + " starting at " + " or ".join(self.start_times) + " and ending at " + " or ".join(self.end_times) + ". "  \
            + "The meeting dates are " + self.meeting_dates[0] + " to " + self.meeting_dates[1] + ". The Instructor(s) for the meetings are: " \
            + " and ".join(self.instructors) + "."

class MeetingTime():
    """
    A unique meeting time for a course, this could mean the course meets with a different time, location, or instructor.
    """
    def __init__(self, instructor, location, start_time, end_time, days, meeting_dates):
        self.instructor = instructor
        self.location = location
        self.start_time = start_time
        self.end_time = end_time
        self.days = self.days_to_ics(days)
        self.meeting_dates = meeting_dates
        self.start = self.build_datetime(meeting_dates[0], start_time)
        self.end = self.build_datetime(meeting_dates[0], end_time)
        self.repeat_until = self.build_datetime(meeting_dates[1], end_time)

    def __str__(self):
        return "This meeting is taught by " + self.instructor + " in " + self.location + " from " + self.start_time \
                + " to " + self.end_time + " on " + self.days

    def days_to_ics(self, days):
        """
        Convert the days the class meets from M, T, W, R, F, S to MO, TU, WE, TH, FR, SA
        Return the converted strings to
        :return:
        """
        days = days.replace("M", "MO")
        days = days.replace("T", "TU")
        days = days.replace("W", "WE")
        days = days.replace("R", "TH")
        days = days.replace("F", "FR")
        days = days.replace("S", "SA")

        return days

    def build_datetime(self, date, time):
        """
        Convert all of the parsed times into datetimes so they can be easily added
        :return: a start time and end time datetime objects
        """
        tz = get_localzone()
        time += "M"
        return dt.strptime(" ".join([date, time]), "%x %I:%M %p")

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
        #TODO: Fix the output for description
        #event['description'] = vText(course.recs) <-- Currently Giving strange output
        print("Recs:", course.recs, "Notes:", course.notes)
        event['location'] = vText(meeting.location)
        event.add('dtstart', self.dt_to_string(meeting.start_time))
        event.add('dtend', self.dt_to_string(meeting.end_time))
        byday_list = list()
        for day in meeting.days.split():
            byday_list.append(vWeekday(day))
        event.add('rrule',{'freq': 'WEEKLY', 'eyday':byday_list, 'until': self.dt_to_string(meeting.repeat_until)})

        return event

    def add_courses_to_calendar(self):
        """
        Add all of the meetings found in the parser to the calendar
        """
        for course in self.target_parser.courses:
            for meeting in course.meeting_times:
                self.ics_calendar.add_component(self.create_course(course, meeting))

    def dt_to_string(self, datetime):
        """
        Method which returns a time in string form properly formatted for .ics
        :param datetime: a time object
        :return: properly formatted string
        """
        return datetime.isoformat()

    def export_to_ics(self, name):
        """
        Export a properly formatted .ics file
        """
        if ".ics" not in name:
            name += ".ics"
        with open(name, "w") as file:
            file.write(self.ics_calendar.to_ical().decode('utf-8'))

def test(ctx, param, value):
        #Run the test suite verbosely
        import pytest
        pytest.main("-vv")
        ctx.exit()

def generator(ctx, param, value):
        #Generate new output files for testing
        import sys
        parser = ScheduleParser()
        backup = sys.stdout
        sys.stdout = open('resources/test_output_tyler_fall_2015', 'w')
        parser.parse_html("resources/tyler_schedule_fall_2015.html")
        print(parser)
        parser = ScheduleParser()
        sys.stdout = open('resources/test_output_sarah_spring_2015', 'w')
        parser.parse_html("resources/sarahs_schedule_spring_2015.html")
        print(parser)
        sys.stdout = backup
        ctx.exit()

@click.command()
@click.option('-t', '--test', help="Run the automatic test suite", is_flag=True, callback=test, expose_value=False, is_eager=True)
@click.option('-d', '--debug', help='Print the output of the state machine', is_flag=True)
@click.option('-g', '--generate', help='Generate testing data', is_flag=True, callback=generator, expose_value=False, is_eager=True)
@click.option('-p', '--profile', help='Profile the functions of the parser', is_flag=True)
@click.option('-i','--input', 'schedule', type=click.Path(exists=True), default='resources/tyler_schedule_fall_2015.html', help='The HTML file containing the schedule')
@click.option('-o', '--output', 'output', type=click.Path(), default='resources/tyler_schedule', help='The name of the schedule to be output')
def main(schedule, output, debug, profile):
    if profile:
        #Profile whatever runs afterwards
        try:
            import cProfile, pstats
            from io import StringIO

        except:
            import profile, pstats
            from io import StringIO
        pr = cProfile.Profile()
        pr.enable()


    parser = ScheduleParser(debug=debug)
    parser.parse_html(schedule)
    print( parser )

    ics = IcsGenerator(parser)
    ics.export_to_ics(output)

    if profile:
        #Stop the profiler and print the stats to the screen
        pr.disable()
        s = StringIO()
        sortby= 'cumulative'
        ps = pstats.Stats(pr, stream=s).strip_dirs().sort_stats(sortby)
        ps.print_stats()
        print(s.getvalue())


if __name__ == "__main__":
    main()

