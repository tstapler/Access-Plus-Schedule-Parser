from bs4 import BeautifulSoup
import re
from icalendar import Calendar, Event, vRecur
import time

class ScheduleParser():
    def __init__(self):
        self.step_numb = 0  # Current Step
        self.class_numb = 0  # Current Class
        self.curr_string = ""
        self.classes = []
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
        return str(self.classes)

    def reset_fields(self):
        for field in self.fields:
            self.fields[field] = ""

    def set_curr_string(self, string):
        self.curr_string = string.strip().replace('\xa0', '')

    def add_to_field_list(self, field, value):
        if (self.fields[field] == ""):
            self.fields[field] = [value]
        else:
            self.fields.setdefault(field, list()).append(value)

    def parse(self):
        """
        Move throughout the state machine.
        """
        if self.step_numb == 0:
            self.section_id()
        elif self.step_numb == 1:
            self.course_name()
        elif self.step_numb == 2:
            self.credits()
        elif self.step_numb == 3:
            self.requirements_meeting_dates()
        elif self.step_numb == 4:
            self.days()
        elif self.step_numb == 5:
            self.times()
        elif self.step_numb == 6:
            self.times()
        elif self.step_numb == 7:
            self.location()

    def strip_all_tags(html):
        if html is None:
            return None
        return ''.join(BeautifulSoup(html).findAll(text=True))

    def section_id(self):
        # Return the Section identifier
        results = re.match(self.field_patterns[0], self.curr_string)
        if results:
            self.fields["section"] = results.group(1)
            self.step_numb += 1

    def course_name(self):
        self.fields["course_name"] = self.curr_string
        self.step_numb += 1

    def credits(self):
        results = re.match(self.field_patterns[1], self.curr_string)
        if (results):
            self.fields["credits"] = results.group(1)
        elif self.curr_string == "Credits":
            self.step_numb += 1

    def requirements_meeting_dates(self):

        results = re.match(self.field_patterns[2], self.curr_string)
        if results:
            self.step_numb += 1
            self.fields["meeting_dates"] = (results.group(1), results.group(2))
        else:
            self.fields["recs"] = self.curr_string

    def days(self):
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
            self.add_to_field_list("days", " ".join(days))
        elif section:  # This is the start of the next class
            self.finish_current_course()
            self.section_id()
        else:
            self.finish_current_course()

    def times(self):
        """
        There will be two times, start and end times for each course meeting
        """
        results = re.match(self.field_patterns[4], self.curr_string)
        if results:
            if self.step_numb == 5:
                self.add_to_field_list("start_times", self.curr_string)
            elif self.step_numb == 6:
                self.add_to_field_list("end_times", self.curr_string)
            self.step_numb += 1

    def location(self):
        """
        Location Is Easy, Just add append the string and check for another meeting day
        """
        self.add_to_field_list("location", self.curr_string)
        self.step_numb = 4  # Return to days because there may be a second meeting time

    def finish_current_course(self):
        """
        Finalize the current course by adding it to the
        course listing and resetting all of the local state variables.
        """
        current_course = self.make_new_course()
        self.classes.append(current_course)
        self.class_numb += 1
        self.step_numb = 0
        self.reset_fields()


    def make_new_course(self):
        """
        Return a properly constructed Course() object initialized from all of the parser's current fields.
        """
        return self.Course(self.fields["course_name"], self.fields["section"], self.fields["credits"],
                      self.fields["recs"], self.fields["meeting_dates"], self.fields["days"], self.fields["start_times"],
                      self.fields["end_times"], self.fields["location"])

    class Course:
        """
        This subclass serves simply as a convenient data structure for holding the data generated by the parser
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

            self.start_in_datetime, self.end_in_datetime = self.time_to_ics()

        def __str__(self):
            """
            Print a pleasant looking string for the Course object
            :return:
            """
            return self.name + ", section " + self.section + ", a " + self.class_credits + " credit class. \n" \
                "This class meets in " + " and ".join(self.locations) + " on " + " ,".join(self.days)       \
                + " starting at " + " ".join(str(self.start_times)) + " and ending at " + " or ".join(self.end_times) +"\n" \
                + " from " + self.meeting_dates[0] + " to " + self.meeting_dates[1]

        def time_to_ics(self):
            """
            Convert all of the parsed times into datetimes so they can be easily added
            :return: a start time and end time datetime objects
            """
            ics_start = self.build_datetime(self.start_times, self.meeting_dates[0])
            ics_end = self.build_datetime(self.end_times, self.meeting_dates[0])
            return ics_start, ics_end

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

    @staticmethod
    def create_course(self, course_to_create):
        """
        Create a new iCalendar Event to be created
        :param course_to_create: the ''Course()'' object that needs to be changed into ics format
        :return:
        """
        created_course = Event()
        created_course["summary"] = course_to_create.name
        created_course["description"] = course_to_create.recs
        created_course["location"] = course_to_create.locations

        return created_course

if __name__ == "__main__":

    with open("sarahs_schedule.html") as schedule:
        soup = BeautifulSoup(schedule)
        parser = ScheduleParser()
        soup.encode('utf-8', 'ignore')

        printing = False

        for span in soup.find_all("td"):

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
        for course in parser.classes:
            print(course)