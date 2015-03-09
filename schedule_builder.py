from bs4 import BeautifulSoup


def rm_chars(string, *args):
    string = string.strip()
    for char in args:
        print char
        string.replace(char, "")
    return string


def stripAllTags(html):
        if html is None:
                return None
        return ''.join( BeautifulSoup(html).findAll(text= True ) )

def line_number_gen():
    number = 0
    while True:
        number += 1
        yield number

line_number = line_number_gen()
f = file("sarahs_schedule.html")
soup = BeautifulSoup(f)
soup.prettify()
soup.encode('ascii', 'ignore')
flag = False
for row in soup.find_all("td"):

    if str(row['class']) == "[u'line-content']":
        row_text = row.get_text().strip().replace("&nbsp;", "")
        if row_text == \
        "For tips on printing the class schedule, click help in upper right corner.":
            flag = True
        elif len(row.contents) == 1 and row_text != "" and flag:
            print next(line_number), row_text
flag = False
for span in soup.find_all("td"):
    try:
        span_text = stripAllTags(span.get_text(strip=True).encode('utf-8'))
        if span_text == "Instructor":
            flag = True
        elif span_text != "" :
            print span_text
        elif span_text == "Credits" and flag:
            flag = False
    except:
        pass
