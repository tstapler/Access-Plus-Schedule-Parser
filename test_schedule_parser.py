__author__ = 'Tyler Stapler'

import schedule_parser, pytest

#TODO: Tests for ScheduleParser
@pytest.fixture
def parser():
    return schedule_parser.ScheduleParser()

@pytest.fixture
def course():
    return schedule_parser.Course("CPRE 281", "Digital Logic", "A", "5.0", "being alive", "This class is cool",
            ("07/08/14", "07/08/15"), ["M W F", "T R"], ["1:00 P", "4:00 P"],
            ["2:00 P", "5:00 P"], ["Durham", "Coover"], ["Go", "Smith"])

@pytest.fixture
def meeting_time():
    return schedule_parser.MeetingTime(
            "Smyth", "Music 102", "4:00 P", "5:00 P", "M T W R F S", ("07/08/15","08/07/15"))

def test_reset_fields(parser):
    for field, value in parser.fields.items():
        if type(value) is list:
            parser.fields[field].append(1)
        else:
            parser.fields[field] = 1

    parser.reset_fields()

    for field, value in parser.fields.items():
        if type(value) is list:
            assert len(value) == 0
        else:
            assert value == ""

#TODO: Add test for resetting courses

def test_set_curr_string(parser):
    parser.curr_string = ""
    parser.set_curr_string("    Test\n\r\xa0       ")
    assert parser.curr_string == "Test"

#TODO: Add more test cases

#TODO:Tests for add_to_field_list

#TODO: Tests for strip_all_tags (Maybe)

def test_set_course_numb(parser):
    #First Edge Case (No instructor or Location)
    parser.set_curr_string(
    "ENGL 314section 1TECHNICAL COMMUNCTN\n\n\n\n 3.0 \n\n\n    Credits"
            )
    parser.set_course_numb()

    assert parser.fields["course_numb"] == "ENGL 314"
    assert parser.fields["section"] == "1"
    assert parser.fields["course_name"] == "TECHNICAL COMMUNCTN"
    assert parser.fields["credits"] == "3.0"
    assert parser.step_numb == 4

    #Second Edge Case (Normal)
    parser.set_curr_string("ENGL 314")
    parser.step_numb = 0
    parser.set_course_numb()

    assert parser.fields["course_numb"] == "ENGL 314"
    assert parser.step_numb == 1

def test_set_section_id(parser):
    #First Edge Case (Number)
    parser.step_numb = 1
    parser.set_curr_string("section 9")
    parser.set_section_id()

    assert parser.fields["section"] == "9"
    assert parser.step_numb == 2

    #Second Edge Case (Letter)
    parser.step_numb = 1
    parser.set_curr_string("section Z")
    parser.set_section_id()

    assert parser.fields["section"] == "Z"
    assert parser.step_numb == 2

    #Third Edge Case (Double Digit Number)
    parser.step_numb = 1
    parser.set_curr_string("section 10")
    parser.set_section_id()

    assert parser.fields["section"] == "10"
    assert parser.step_numb == 2

def test_set_course_name(parser):
    parser.step_numb = 2
    parser.set_curr_string("How to College")
    parser.set_course_name()

    assert parser.fields["course_name"] == "How to College"
    assert parser.step_numb == 3

def test_set_numb_credits(parser):
    parser.step_numb = 3
    parser.set_curr_string("2.0")
    parser.set_numb_credits()

    assert parser.step_numb == 3
    assert parser.fields["credits"] == "2.0"

    parser.set_curr_string("Jibberish")
    parser.set_numb_credits()

    assert parser.step_numb == 3
    assert parser.fields["credits"] == "2.0"

    parser.set_curr_string("Credits")
    parser.set_numb_credits()

    assert parser.step_numb == 4
    assert parser.fields["credits"] == "2.0"

def test_set_drop_date(parser):
    parser.step_numb = 4
    parser.set_curr_string(
            "Last day to drop w/o extenuating circumstances: 11/08/2299"
            )
    parser.set_drop_date()

    assert parser.fields["drop_date"] == "11/08/2299"
    assert parser.step_numb == 5

    parser.step_numb = 4
    parser.set_curr_string(
            "Last day to drop w/o extenuating circumstances: 07/31/2015"
            )
    parser.set_drop_date()

    assert parser.fields["drop_date"] == "07/31/2015"
    assert parser.step_numb == 5

def test_set_reference_numb(parser):
    parser.step_numb = 5
    parser.set_curr_string("Reference #:")
    parser.set_reference_numb()

    assert parser.step_numb == 5
    assert parser.fields["ref_numb"] == ""

    parser.set_curr_string("3435789")
    parser.set_reference_numb()

    assert parser.step_numb == 6
    assert parser.fields["ref_numb"] == "3435789"

def test_set_requirements(parser):
    parser.step_numb = 6
    parser.set_curr_string("Prerequisites:")
    parser.set_requirements()

    assert parser.step_numb == 6
    assert parser.fields["recs"] == ""

    parser.set_curr_string(
            "H20 420 (Underwater Basketweaving)"
            )
    parser.set_requirements()

    assert parser.step_numb == 6
    assert parser.fields["recs"] == "H20 420 (Underwater Basketweaving)"

    parser.set_curr_string(" and stuff")
    parser.set_requirements()

    assert parser.step_numb == 6
    assert parser.fields["recs"] == \
                         "H20 420 (Underwater Basketweaving) and stuff"

    parser.set_curr_string("Notes:")
    parser.set_requirements()

    assert parser.step_numb == 7
    assert parser.fields["recs"] == \
                         "H20 420 (Underwater Basketweaving) and stuff"

    parser.step_numb = 6
    parser.fields["recs"] = ""
    parser.set_curr_string("Meeting Dates:")
    parser.set_requirements()

    assert parser.step_numb == 8
    assert parser.fields["recs"] == ""

def test_set_notes(parser):
    parser.step_numb = 7
    parser.set_curr_string("MOST SECTIONS OF THIS CLASS WILL NOT PASS")
    parser.set_notes()

    assert parser.step_numb == 7
    assert parser.fields["notes"] == "MOST SECTIONS OF THIS CLASS WILL NOT PASS"

    parser.set_curr_string("NO REALLY")
    parser.set_notes()

    assert parser.step_numb == 7
    assert parser.fields["notes"] == "MOST SECTIONS OF THIS CLASS WILL NOT PASS NO REALLY"

    parser.set_curr_string("Meeting Dates:")
    parser.set_notes()

    assert parser.step_numb == 8
    assert parser.fields["notes"] == "MOST SECTIONS OF THIS CLASS WILL NOT PASS NO REALLY"

def test_set_meeting_dates(parser):
    parser.step_numb = 8
    parser.set_curr_string("NOT A DATE")
    parser.set_meeting_dates()

    assert parser.step_numb == 8
    assert parser.fields["meeting_dates"] == ""

    parser.set_curr_string("08/24/15-12/18/15")
    parser.set_meeting_dates()

    assert parser.step_numb == 9
    assert parser.fields["meeting_dates"] == ("08/24/15", "12/18/15")

def test_skip_headers(parser):
    parser.step_numb = 9
    parser.set_curr_string("Garbage")
    parser.skip_headers()

    assert parser.step_numb == 9

    parser.set_curr_string("More Garbage")
    parser.skip_headers()

    assert parser.step_numb == 9

    parser.set_curr_string("Still Garbage")
    parser.skip_headers()

    assert parser.step_numb == 9


    parser.set_curr_string("Instructor")
    parser.skip_headers()

    assert parser.step_numb == 10

def test_set_meeting_days(parser):
    #First Edge Case - Meets Every Day
    parser.step_numb = 10
    parser.set_curr_string("MTWRF")
    parser.set_meeting_days()

    #Compare the list of days individually EG: assert M == M, assert T == T
    for letter, test in zip(parser.fields["days"][0], "M T W R F"):
        assert letter == test

    parser.reset_fields()

    #Second Edge Case - Arranged Class, Doesnt meet
    parser.step_numb = 10
    parser.set_curr_string("ARR.")
    parser.set_meeting_days()

    assert parser.step_numb == 14

    parser.reset_fields()

    #Third Edge Case - Regular class with dates listed
    parser.step_numb = 10
    parser.set_curr_string("M W F")
    parser.set_meeting_days()

    assert parser.step_numb == 11
    for letter, test in zip(parser.fields["days"][0], "M W F"):
        assert letter == test

    #Fourth Edge Case - Start of new Course
    parser.step_numb = 10
    parser.set_curr_string("CPRE 281")

    parser.set_meeting_days()

    assert parser.step_numb == 1
    assert parser.fields["course_numb"] == "CPRE 281"

def test_set_meeting_times(parser):
    #First Edge Case - Results on first time
    parser.step_numb = 11
    parser.set_curr_string("11:00 A")
    parser.set_meeting_times()

    assert parser.step_numb == 12
    assert parser.fields["start_times"][0] == "11:00 A"

    #Second Edge Case - Results on second time
    parser.step_numb = 12
    parser.set_curr_string("11:50 A")
    parser.set_meeting_times()

    assert parser.step_numb == 13
    assert parser.fields["end_times"][0] == "11:50 A"

    #Third Edge Case - Multiple start times
    parser.step_numb = 11
    parser.set_curr_string("12:10 P")
    parser.set_meeting_times()

    assert parser.step_numb == 12
    assert len(parser.fields["start_times"]) == 2
    assert parser.fields["start_times"][1] == "12:10 P"

    #Fourth Edge Case - Multiple end times
    parser.step_numb = 12
    parser.set_curr_string("12:50 P")
    parser.set_meeting_times()

    assert parser.step_numb == 13
    assert len(parser.fields["end_times"]) == 2
    assert parser.fields["end_times"][1] == "12:50 P"

#TODO: Tests for set_location
def test_set_location(parser):
    #First Edge Case - This is the start of a new course and the location and instructor are not listed
    parser.step_numb = 13
    parser.set_curr_string(
    "ENGL 314section 1TECHNICAL COMMUNCTN\n\n\n\n 3.0 \n\n\n    Credits"
            )
    parser.set_location()

    assert parser.step_numb == 4
    assert parser.courses[0].locations[0] == "Unknown"
    assert parser.courses[0].instructors[0] == "Unknown"

    parser.reset_fields()

    #Second Edge Case - This is the start of a seperate meeting time and there is no location or instructor
    parser.step_numb = 13
    parser.set_curr_string("M W F")
    parser.set_location()

    assert parser.step_numb == 11
    assert parser.fields["location"][0] == "Unknown"
    assert parser.fields["instructor"][0] == "Unknown"
    assert parser.fields["days"][0] == "M W F"

    parser.reset_fields()

    #Third Edge Case - This is a class location
    parser.step_numb = 13
    parser.set_curr_string("Coover Hall")
    parser.set_location()

    assert parser.step_numb == 14
    assert parser.fields["location"][0] == "Coover Hall"

#TODO: Tests for set_instructor
def test_set_instructor(parser):
    parser.step_numb = 14
    parser.set_curr_string("Smyth")
    parser.set_instructor()

    assert parser.step_numb == 10
    assert parser.fields["instructor"][0] == "Smyth"

#TODO: Tests for finish_current_course
def test_finish_current_course(parser):
    parser.step_numb == 10
    parser.finish_current_course(current_course=course)
    print(parser.courses[0])

    assert len(parser.courses) == 1
    assert parser.step_numb == 0

#TODO: Tests for parse_html
def test_parse_html(parser, capsys):
    #Edge Case One - Tyler's Fall 2015 Schedule without instructors or locations
    parser.parse_html("resources/tyler_schedule_fall_2015.html")
    print(parser)
    resout, reserr = capsys.readouterr()
    expected = open("resources/test_output_tyler_fall_2015", "r").read()
    assert resout == expected

    parser.clear()

    #Edge Case Two - Sarah's Spring 2015 Schedule with instructors and locatons
    parser.parse_html("resources/sarahs_schedule_spring_2015.html")
    print(parser)
    resout, reserr = capsys.readouterr()
    expected = open("resources/test_output_sarah_spring_2015", "r").read()
    assert resout == expected

    parser.clear()


#TODO: Tests for MeetingTime
def test_meeting_time(meeting_time):
    assert meeting_time.instructor == "Smyth"
    assert meeting_time.location == "Music 102"
    assert meeting_time.start_time == "4:00 P"
    assert meeting_time.end_time == "5:00 P"
    assert meeting_time.days == "MO TU WE TH FR SA"
    assert meeting_time.meeting_dates == ("07/08/15","08/07/15")

#TODO: Tests for days_to_ics
def test_days_to_ics(meeting_time):
    meeting_time.days = "M T W R F S"
    meeting_time.days_to_ics()

    assert meeting_time.days == "MO TU WE TH FR SA"

#TODO: Tests for time_struct_to_datetime
#TODO: Tests for build_datetime
#TODO: Tests for datetime_to_string

#TODO: Tests for IcsGenerator
#TODO: Tests for create_course
#TODO: Tests for add_courses_to_calendar

