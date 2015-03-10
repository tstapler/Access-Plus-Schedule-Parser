from bs4 import BeautifulSoup
import re
def stripAllTags(html):
        if html is None:
                return None
        return ''.join( BeautifulSoup(html).findAll(text= True ) )

def section(string, numb):
    #Return the Section identifier
    results = re.match(field_patterns[0],string)
    fields["section"].append(results.group(1))
    numb += 1
    return numb

def courseName(string, numb):
    fields["course_name"].append(string)
    numb += 1
    return numb

def credits(string, numb):
    results = re.match(field_patterns[1],string)
    if(results):
        fields["credits"].append(results.group(1))

    elif string == "Credits":
        numb += 1

    return numb

def requirements_meeting_dates(string, numb):
    results = re.match(field_patterns[2],string)
    if results:
        fields["meeting_dates"].append((results.group(0),results.group(1)))
f = open("sarahs_schedule.html")
soup = BeautifulSoup(f)
soup.prettify()
soup.encode('utf-8', 'ignore')

printing = False

class_numb = 0
field_numb = 0

fields = {
   "section": [],
    "course_name": [],
    "credits": [],
    "recs": [],
    "meeting_dates": [],
    "days": [],
    "start_time": [],
    "end_time": [],
    "location": []
}

field_patterns = [
    re.compile('section *(.*)'),
    re.compile('(\d\.\d)'),
    re.compile('^(\d\d/\d\d/\d\d)-(\d\d/\d\d/\d\d)')
]

options = {
    0 : section,

}
for span in soup.find_all("td"):

    try:
        span_text = stripAllTags(span.get_text(strip=True).encode('ascii', 'replace'))
        if "section" in span_text:
            printing = True
            print(span_text.strip())
            class_numb += 1
        elif "FOOTER" in span_text and printing:
            printing = False
        elif "%=" in span_text and printing:
            continue
        elif span_text != "" and printing:

            print(span_text.strip())
    except:
        continue

