from bs4 import BeautifulSoup


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
soup.find_all('table')
for row in soup.find_all("td"):
    # print(str(row['class']))
    if str(row['class']) == "[u'line-content']":
        if len(row.contents) == 1 and row.get_text().strip() != "":
            row.replace("&nbsp", "")
            print next(line_number), row.get_text().strip()
        elif len(row.contents) > 1:
            for child in row.contents:
                if child != "":
                    print "Line", next(line_number), child
