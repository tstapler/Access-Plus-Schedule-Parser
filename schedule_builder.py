from bs4 import BeautifulSoup
import re
from icalendar import Calendar, Event, vRecur, vText
import time
import icalendar

# TODO: Support python 3.4 because it prints out MORE data than python 3.3 or 2.7.....

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
            "meeting_types": list(),
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

    def parse(self):
        """
        Move throughout the state machine.
        """
        print("Step:" + str(self.step_numb))
        if self.step_numb == 0:
            self.set_section_id()
        elif self.step_numb == 1:
            self.set_course_name()
        elif self.step_numb == 2:
            self.set_numb_credits()
        elif self.step_numb == 3:
            self.set_requirements_and_meeting_dates()
        elif self.step_numb == 4:
            self.set_meeting_days()
        elif self.step_numb == 5:
            self.set_meeting_times()
        elif self.step_numb == 6:
            self.set_meeting_times()
        elif self.step_numb == 7:
            self.set_location()
            
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

    # TODO: Rigorous testing of this method to find what actually happens here and if morecases are needed
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
            self.add_value_to_field_list("meeting_types","ARR.")
            self.finish_current_course()
        elif results: # Normal class with days listed, proceed to the next state
            days = ""
            self.step_numb += 1
            for result in results:
                days += result
            print("Days Value", self.fields["days"])
            self.add_value_to_field_list("days", " ".join(days))
            self.add_value_to_field_list("meeting_types", "STANDARD")
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
                      self.fields["recs"], self.fields["meeting_types"], self.fields["meeting_dates"],
                      self.fields["days"], self.fields["start_times"], self.fields["end_times"], self.fields["location"])

# TODO: Refactor and create a meeting time subclass, this will make it easier to parse through the code
class Course:
    """
    This class serves simply as a convenient data structure for holding the data generated by the parser
    and converting it to other forms
    """
    def __init__(self, name, section, class_credits, recs, meeting_types,
                 meeting_dates, days, start_times, end_times, locations):
        self.name = name
        self.section = section
        self.class_credits = class_credits
        self.recs = recs
        self.meeting_times = []
        for numb, meeting_type in enumerate(meeting_types):
                self.number_of_meetings = numb
                self.meeting_times = [self.MeetingTime(meeting_type, meeting_dates, days[numb], start_times[numb],
                                                       end_times[numb], locations[numb])]


    # def __str__(self):
    #     """
    #     Print a pleasant looking string for the Course object
    #     :return:
    #     """
    #     # TODO: Refactor this class so that it diaplays all times
    #     return self.name + ", section " + self.section + ", a " + self.class_credits + " credit class. \n" \
    #         "This class meets in " + " and ".join(self.locations) + " on " + " ,".join(self.days)       \
    #         + " starting at " + " ".join(str(self.start_times)) + " and ending at " + " or ".join(self.end_times) +"\n" \
    #         + " from " + self.meeting_dates[0] + " to " + self.meeting_dates[1]

    class MeetingTime():

        def __init__(self, meeting_type, meeting_dates, days, start_times, end_times, locations):
            self.meeting_type = meeting_type
            # TODO: Change meeting Dates to a list of tuples
            self.meeting_date_start, self.meeting_date_end = meeting_dates

            self.days = days
            self.start_times = start_times
            self.end_times = end_times
            self.locations = locations

            self.start_in_datetime, self.end_in_datetime,self.repeat_until = self.time_to_ics()
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

        def time_to_ics(self):
            """
            Convert all of the parsed times into datetimes so they can be easily added
            :return: a start time and end time datetime objects
            """
            ics_start = self.build_datetime(self.start_times, self.meeting_date_start)
            ics_end = self.build_datetime(self.end_times, self.meeting_date_start)
            ics_repeat_until = self.build_datetime(self.end_times,self.meeting_date_end)
            return self.datetime_to_string(ics_start), self.datetime_to_string(ics_end), self.datetime_to_string(ics_repeat_until)

        @staticmethod
        def build_datetime(in_time, in_date):
            """
            Make a datetime from the various strings that we were able to parse
            :param time: a meeting time string(s) for converting
            :param date: the date to append to the time
            :return: return the completed datetime object
            """
            # Append an M to the end of each string to make A and P into AM or PM respectively
            date_time = in_time + "M"
            # Append the Date to the time string
            date_time = date_time + " " + in_date
            # Parse the string to pull out the relevant time data into an object
            return time.strptime(date_time, "%M:%S %p %x")

        @staticmethod
        def datetime_to_string(datetime):
            """
            Method which returns a time in string form properly formatted for .ics
            :param datetime: a time object
            :return: properly formatted string
            """
            datetime = time.strftime("%Y%m%dT%H%M%S", datetime)
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
        self.ics_calendar = icalendar.Calendar()
        self.add_courses_to_calendar()

    def add_courses_to_calendar(self):
        """
        Adds all of the courses in the target parser to the calendar
        """
        for course in self.target_parser.courses:
            for meeting_time in course.meeting_times:
                if meeting_time.meeting_type == "STANDARD":
                    self.ics_calendar.add_component(self.create_course(meeting_time))

    @staticmethod
    def create_course(name, recs, meeting):
        """
        Create a new iCalendar Event to be created
        :param course: the ''Course()'' object that needs to be changed into ics format
        :return: an Event object initialized with the course's data
        """
        # TODO: Handle multiple meeting events
        # TODO: Check the encoding of the parameters in rrule apparently parameter encoding is not supported
        event = icalendar.Event()
        event["summary"] = name
        event["description"] = recs
        event["location"] = meeting.locations
        event["dtstart"] = meeting.start_in_datetime
        event['dtend'] = meeting.end_in_datetime
        # TODO: Validation for the edge cases & Remove hardcoded list values
        rrule = vRecur({'freq':'WEEKLY', 'byday': vText(course.days), 'until': course.repeat_until})
        event.add('rrule',rrule)
        return event


    def export_to_ics(self):
        with open("class_schedule.ics", "w") as file:
            file.write(self.ics_calendar.to_ical())

    def pprint_calendar(self):
        return self.ics_calendar.to_ical().replace('\r\n', '\n').strip()

if __name__ == "__main__":

    with open("resources\sarahs_schedule.html") as schedule:
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
            elif "%=" in span_text or "Last" in span_text or "Textbook" in span_text or "Instructor" in span_text and printing:
                continue
            elif span_text != "" and printing:
                print(span_text.strip())
                parser.parse()

        print("Current Course Schedule:")
        for course in parser.courses:
            print(course)

        ics = IcsGenerator(parser)
        print(ics.pprint_calendar())