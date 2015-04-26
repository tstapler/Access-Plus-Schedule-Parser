from bs4 import BeautifulSoup
import re
from icalendar import Calendar, Event, vRecur
import time


#TODO: Separate the set_requirements_and_meeting_dates method into its component parts
#TODO: Create notes method
#TODO: Create prerequisites method
class ScheduleParser():
    def __init__(self):
        self.step_numb = 0  # Current Step
        self.class_numb = 0  # Current Class
        self.curr_string = ""
        self.courses = []
        self.fields = {
            "section": "",
            "course_name": "",
            "credits": "",
            "recs": "",
            "meeting_dates": "",
            "days": list(),
            "start_times": list(),
            "end_times": list(),
            "location": list()
        }
        self.field_patterns = [
            re.compile('section *(.*)'),
            re.compile('(\d\.\d)'),
            re.compile('^(\d\d/\d\d/\d\d)-(\d\d/\d\d/\d\d)'),
            re.compile(r'\b[MTWRF]\b'),
            re.compile('\d\d:\d\d \s*')
        ]

    def __str__(self):
        return str(self.courses)

    def reset_fields(self):
        for field in self.fields:
            self.fields[field] = ""

    def set_curr_string(self, string):
        self.curr_string = string.strip().replace('\xa0', '')

    def add_value_to_field_list(self, field, value):
        if (self.fields[field] == ""):
            self.fields[field] = [value]
        else:
            self.fields.setdefault(field, list()).append(value)

    #TODO:Recalculate the correct number of steps/fields needed
    def parse(self):
        """
        Move throughout the state machine.
        """
        print(self.step_numb)
        if self.step_numb == 0:
            self.set_section_id()

        elif self.step_numb == 1:
            self.set_course_name()

        elif self.step_numb == 2:
            self.set_numb_credits()

        elif self.step_numb == 3:
            #TODO: Create method
            self.set_drop_date()

        elif self.step_numb == 4:
            #TODO: Create method
            self.set_reference_numb()

        elif self.step_numb == 5:
            #TODO: Create method
            self.set_notes()

        elif self.step_numb == 6:
            #TODO: Create method
            self.set_requirements()

        elif self.step_numb == 7:
            #TODO: Create method
            self.set_meeting_dates()

        elif self.step_numb == 8:
            self.set_meeting_days()

        elif self.step_numb == 9:
            self.set_meeting_times()

        elif self.step_numb == 10:
            self.set_meeting_times()

        elif self.step_numb == 11:
            self.set_location()

        elif self.step_numb == 12:
            self.set_instructor()

    @staticmethod
    def strip_all_tags(html):
        if html is None:
            return None
        return ''.join(BeautifulSoup(html).findAll(text=True))

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
        elif self.curr_string == "Credits":
            self.step_numb += 1

    def set_drop_date(self):
        results = re.match(self.fiels_patterns[2], self.curr_string)
        self.fields["drop_date"]
        self.step_numb +=1

    def set_reference_num(self):
        return

    def set_notes(self):
        return

    def set_requirements_and_meeting_dates(self):
        """
        It's difficult to tell when the class details end, keep parsing until you match the meeting dates which
        are the next thing on the list.
        """
        results = re.match(self.field_patterns[2], self.curr_string)
        if results:
            self.step_numb += 1
            self.fields["meeting_dates"] = (results.group(1), results.group(2))
        else:
            self.fields["recs"] = self.curr_string

    def set_meeting_days(self):
        """
        Check for the four possible cases:
        1. If the course is arranged it has no meeting times so finish parsing this course and reset

        2. If the course is normal continue

        3. This is the second or third time here and we have reached the start of the next course
        """
        results = re.findall(self.field_patterns[3], self.curr_string)
        section = re.match(self.field_patterns[0], self.curr_string)
        if self.curr_string == "ARR.":  # If this class has no meeting dates this is the end of the state machine loop
            self.finish_current_course()
        elif results: # Normal class with days listed, proceed to the next state
            days = ""
            self.step_numb += 1
            for result in results:
                days += result
            print("Days Value", self.fields["days"])
            self.add_value_to_field_list("days", " ".join(days))
        elif section:  # This is the start of the next class
            self.finish_current_course()
            self.set_section_id()
        else:
            self.finish_current_course()

    def set_meeting_times(self):
        """
        There will be two times, start and end times for each course meeting
        """
        results = re.match(self.field_patterns[4], self.curr_string)
        if results:
            if self.step_numb == 5:
                self.add_value_to_field_list("start_times", self.curr_string)
            elif self.step_numb == 6:
                self.add_value_to_field_list("end_times", self.curr_string)
            self.step_numb += 1

    def set_location(self):
        """
        Location Is Easy, Just add append the string and check for another meeting day
        """
        self.add_value_to_field_list("location", self.curr_string)
        self.step_numb = 4  # Return to days because there may be a second meeting time

    def set_instructor(self):
        return

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
        return Course(self.fields["course_name"], self.fields["section"], self.fields["credits"],
                      self.fields["recs"], self.fields["meeting_dates"], self.fields["days"], self.fields["start_times"],
                      self.fields["end_times"], self.fields["location"])

# TODO: Refactor and create a meeting time subclass, this will make it easier to parse through the code
class Course:
    """
    This class serves simply as a convenient data structure for holding the data generated by the parser
    and converting it to other forms
    """
    def __init__(self, name, section, class_credits, recs, meeting_dates, days, start_times, end_times, locations):
        self.name = name
        self.section = section
        self.class_credits = class_credits
        self.recs = recs
        self.meeting_dates = meeting_dates
        self.days = days
        self.start_times = start_times
        self.end_times = end_times
        self.locations = locations

        self.start_in_datetime, self.end_in_datetime,self.repeat_until = self.time_to_ics()
        self.days_to_ics()

    def __str__(self):
        """
        Print a pleasant looking string for the Course object
        :return:
        """
        return self.name + ", section " + self.section + ", a " + self.class_credits + " credit class. \n" \
            "This class meets in " + " and ".join(self.locations) + " on " + " ,".join(self.days)       \
            + " starting at " + " ".join(str(self.start_times)) + " and ending at " + " or ".join(self.end_times) +"\n" \
            + " from " + self.meeting_dates[0] + " to " + self.meeting_dates[1]

    def days_to_ics(self):
        """
        Convert the days the class meets from M, T, W, R, F to MO, TU, WE, TH, FR
        Return the converted strings to
        :return:
        """
        for meeting in self.days:
            meeting = meeting.replace("M", "MO")
            meeting = meeting.replace("T", "TU")
            meeting = meeting.replace("W", "WE")
            meeting = meeting.replace("R", "TH")
            meeting = meeting.replace("F", "FR")

    def time_to_ics(self):
        """
        Convert all of the parsed times into datetimes so they can be easily added
        :return: a start time and end time datetime objects
        """
        ics_start = self.build_datetime(self.start_times, self.meeting_dates[0])
        ics_end = self.build_datetime(self.end_times, self.meeting_dates[0])
        ics_repeat_until = self.build_datetime(self.end_times,self.meeting_dates[1])
        return self.datetime_to_string(ics_start), self.datetime_to_string(ics_end), self.datetime_to_string(ics_repeat_until)

    def build_datetime(self, times, date):
        """
        Make a datetime from the various strings that we were able to parse
        :param times: a meeting time string(s) for converting
        :param date: the date to append to the time
        :return: return the completed datetime object
        """
        # Append an M to the end of each string to make A and P into AM or PM respectively
        ics_start = map(lambda string: string + "M", self.start_times)
        # Append the Date to the time string
        ics_start = map(lambda time_str: time_str + " " + self.meeting_dates[0], ics_start)
        # Parse the string to pull out the relevant time data into an object
        return list(map(lambda start_time: time.strptime(start_time, "%M:%S %p %x"), ics_start))


    @staticmethod
    def datetime_to_string(datetime):
        """
        Method which returns a time in string form properly formatted for .ics
        :param datetime: a time object
        :return: properly formatted string
        """
        for index, dates in enumerate(datetime):
            datetime[index] = time.strftime("%Y%m%dT%H%M%S", dates)
        return datetime


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
        self.add_courses_to_calendar()

    @staticmethod
    def create_course(course):
        """
        Create a new iCalendar Event to be created
        :param course: the ''Course()'' object that needs to be changed into ics format
        :return: an Event object initialized with the course's data
        """
        # TODO: Handle multiple meeting events
        # TODO: Check the encoding of the parameters in rrule apparently parameter encoding is not supported
        event = Event()
        event["summary"] = course.name
        event["description"] = course.recs
        event["location"] = course.locations
        event["dtstart"] = course.start_in_datetime
        event['dtend'] = course.end_in_datetime
        # TODO: Validation for the edge cases & Remove hardcoded list values
        event.add('rrule',{'freq': 'WEEKLY', 'byday': course.days[0], 'until': course.repeat_until[0]})
        return event

    def add_courses_to_calendar(self):
        for course in self.target_parser.courses:
            self.ics_calendar.add_component(self.create_course(course))

    def export_to_ics(self):
        with open("class_schedule.ics", "w") as file:
            file.write(self.ics_calendar.to_ical())

    def pprint_calendar(self):
        return self.ics_calendar.to_ical().replace('\r\n', '\n').strip()

if __name__ == "__main__":

    with open("sarahs_schedule.html") as schedule:
        soup = BeautifulSoup(schedule)
        parser = ScheduleParser()
        soup.encode('utf-8', 'ignore')

        printing = False


        for span in soup.find_all("td"):

            #TODO: Pull this functionality into the ScheduleParser class
            span_text = ScheduleParser.strip_all_tags(span.get_text(strip=True))
            parser.set_curr_string(span_text)
            if "section" in span_text:
                printing = True
                print(span_text.strip())
                parser.parse()

            elif "FOOTER" in span_text and printing:
                printing = False
            elif "%=" in span_text and printing:
                continue
            elif span_text != "" and printing:
                print(span_text.strip())
                parser.parse()

        print("Current Course Schedule:")
        for course in parser.courses:
            print(course)

        ics = IcsGenerator(parser)
        print(ics.pprint_calendar())
