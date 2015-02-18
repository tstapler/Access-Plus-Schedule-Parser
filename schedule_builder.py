from bs4 import BeautifulSoup

f = file("sarahs_schedule.html")
soup = BeautifulSoup(f)
soup.prettify()
print(soup.get_text())

for row in soup.find_all("table"):
	print(row.prettify())
