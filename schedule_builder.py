from bs4 import BeautifulSoup
import re
import pprint


class ScheduleParser():

    def __init__(self):
        self.step_numb = 0 # Current Step
        self.class_numb = 0 # Current Class
        self.curr_string = ""
        self.classes = []
        self.fields = {
            "section": "",
            "course_name": "",
            "credits": "",
            "recs": "",
            "meeting_dates": "",
            "days": "",
            "start_time": "",
            "end_time": "",
            "location": ""
        }
        self.field_patterns = [
            re.compile('section *(.*)'),
            re.compile('(\d\.\d)'),
            re.compile('^(\d\d/\d\d/\d\d)-(\d\d/\d\d/\d\d)'),
            re.compile('[MTWRF]'),
            re.compile('\d\d:\d\d \s*')
        ]

    def __str__(self):
        return str(self.classes)

    def set_curr_string(self, string):
        self.curr_string = string

    def parse(self):
        #print("Step:", self.step_numb)
        if self.step_numb == 0:
            self.section()
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
        return ''.join( BeautifulSoup(html).findAll(text= True ) )

    def section(self):
        #Return the Section identifier
        results = re.match(self.field_patterns[0],self.curr_string)
        if results:
            self.fields["section"] = results.group(1)
            self.step_numb += 1

    def course_name(self):
        self.fields["course_name"] = self.curr_string
        self.step_numb += 1

    def credits(self):
        results = re.match(self.field_patterns[1],self.curr_string)
        if(results):
            self.fields["credits"] = results.group(1)

        elif self.curr_string == "Credits":
            self.step_numb += 1

    def requirements_meeting_dates(self):
        if self.curr_string == "ARR.":
            self.step_numb = 0
            return
        results = re.match(self.field_patterns[2],self.curr_string)
        if results:
            self.step_numb += 1
            self.fields["meeting_dates"] = (results.group(1),results.group(2))
        else:
            self.fields["recs"] = self.curr_string

    def days(self):
        results = re.findall(self.field_patterns[3], self.curr_string)
        if results:
            for result in results:
                self.fields["days"] += result
            self.fields["days"] = " ".join(self.fields["days"])
            self.step_numb += 1

    def times(self):
        results = re.match(self.field_patterns[4], self.curr_string)
        if results:
            if self.step_numb == 5:
                self.fields["start_time"] = self.curr_string
            elif self.step_numb == 6:
                self.fields["end_time"] = self.curr_string
            self.step_numb += 1

    def location(self):
        self.fields["location"] = self.curr_string

        self.classes.append(self.fields)
        print(self.classes)
        for field in self.fields:
            self.fields[field] = ""
        self.step_numb = 0
        self.class_numb += 1



if __name__ == "__main__":

    f = open("sarahs_schedule.html")
    
    soup = BeautifulSoup(f)
    parser = ScheduleParser()
    
    soup.prettify()
    soup.encode('utf-8', 'ignore')

    printing = False

    for span in soup.find_all("td"):

        try:
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
            elif span_text != "" and span_text != "\n" and printing:
                print(span_text.strip())
                parser.parse()
        except:
            continue
    pprint.pprint(str(parser))