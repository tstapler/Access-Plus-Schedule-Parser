from bs4 import BeautifulSoup

def stripAllTags(html):
        if html is None:
                return None
        return ''.join( BeautifulSoup(html).findAll(text= True ) )


f = open("sarahs_schedule.html")
soup = BeautifulSoup(f)
soup.prettify()
soup.encode('utf-8', 'ignore')
flag = False

for span in soup.find_all("td"):
    try:
        span_text = stripAllTags(span.get_text(strip=True).encode('ascii', 'replace'))
        if "section" in span_text:
            flag = True
            print(span_text)
        elif "FOOTER" in span_text and flag:
            flag = False
        elif "%=" in span_text and flag:
            continue
        elif span_text != "" and flag:
            print(span_text)
    except:
        continue
