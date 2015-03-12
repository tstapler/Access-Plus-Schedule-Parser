from bs4 import BeautifulSoup
import re
import pprint

# TODO: Account for classes with more than one meeting time
# TODO: Change days, start times and end times to use arrays for multiple meeting dates
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

    def set_curr_string(self, string):
        self.curr_string = string.strip()

    def add_to_field_list(self, field, value):
        if (self.fields[field] == ""):
            self.fields[field] = [value]
        else:
            self.fields.setdefault(field, list()).append(value)

    def parse(self):
        print("Step:", self.step_numb)
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
            # TODO: Strip Special Caracters from Input
            self.fields["section"] = results.group(1)
            self.step_numb += 1

    def course_name(self):
        # TODO: Strip Special Characters from input
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
        results = re.findall(self.field_patterns[3], self.curr_string)
        section = re.match(self.field_patterns[0], self.curr_string)
        if self.curr_string == "ARR.":  # If this class has no meeting dates this is the end
            self.finish_current_class()
        elif results:  # These are actually meeting Dates
            days = ""
            self.step_numb += 1
            for result in results:
                days += result
            print("Days Value", self.fields["days"])
            self.add_to_field_list("days", " ".join(days))
        elif section:  # This is the start of the next class
            self.finish_current_class()
            self.section_id()
        else:
            self.finish_current_class()

    def times(self):
        results = re.match(self.field_patterns[4], self.curr_string)
        if results:
            if self.step_numb == 5:
                self.add_to_field_list("start_times", self.curr_string)
            elif self.step_numb == 6:
                self.add_to_field_list("end_times", self.curr_string)
            self.step_numb += 1

    def location(self):
        self.add_to_field_list("location", self.curr_string)
        self.step_numb = 4  # Return to days because there may be a second meeting time

    def finish_current_class(self):
        print(self.fields)
        self.classes.append(self.fields.copy())
        for field in self.fields:
            self.fields[field] = ""
        self.class_numb += 1
        self.step_numb = 0
        print(self.classes)

        # TODO: Create a class for Course to better store all of the data


if __name__ == "__main__":

    f = open("sarahs_schedule.html")

    soup = BeautifulSoup(f)
    parser = ScheduleParser()

    # soup.prettify()
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

    pprint.pprint(str(parser))