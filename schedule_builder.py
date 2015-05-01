from bs4 import BeautifulSoup
import re
from icalendar import Calendar, Event, vRecur
import time


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

    #TODO: Edit function to work with the addtion of Instructor
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

# TODO: Refactor and create a meeting time subclass, this will make it easier to parse through the code
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

        self.start_in_datetime, self.end_in_datetime,self.repeat_until = self.time_to_ics()
        self.days_to_ics()

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
        count = 0

        for span in soup.find_all("td"):

            #TODO: Pull this functionality into the ScheduleParser class
            span_text = ScheduleParser.strip_all_tags(span.get_text(strip=True))
            parser.set_curr_string(span_text)
            if "View Complete Textbook List" in span_text:
                if count == 1:
                    printing = True
                count += 1

            elif "FOOTER" in span_text and printing:
                printing = False
            elif "%=" in span_text and printing:
                continue
            elif span_text != "" and printing:
                if(span_text.strip() != ""):
                    print(span_text.strip())
                    parser.parse()

        print("Current Course Schedule:")
        for course in parser.courses:
            print(str(course) + "\n")

        # ics = IcsGenerator(parser)
