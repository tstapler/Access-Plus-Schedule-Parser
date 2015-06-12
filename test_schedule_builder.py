__author__ = 'Tyler Stapler'

import schedule_builder, pytest

#TODO: Tests for ScheduleParser
@pytest.fixture
def parser():
    return schedule_builder.ScheduleParser()

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

    parser.set_curr_string("Jibberish")
    parser.set_numb_credits()

    parser.set_curr_string("Credits")
    parser.set_numb_credits()

    assert parser.step_numb == 4
    assert parser.fields["credits"] == "2.0"

#TODO: Tests for set_drop_date
def test_set_drop_date(parser):
    parser.step_numb = 4
    parser.set_curr_string(
            "Last day to drop w/o extenuating circumstances: 11/08/2299"
            )

    parser.set_drop_date()

    assert parser.fields["drop_date"] == "11/08/2299"
    assert parser.step_numb == 5

#TODO: Tests for set_reference_numb
#TODO: Tests for set_requirements
#TODO: Tests for set_notes
#TODO: Tests for set_meeting_dates
#TODO: Tests for skip_headers
#TODO: Tests for set_meeting_days
#TODO: Tests for set_meeting_times
#TODO: Tests for set_location
#TODO: Tests for set_instructor
#TODO: Tests for finish_current_course
#TODO: Tests for make_new_course
#TODO: Tests for parse_html

#TODO: Tests for MeetingTime
#TODO: Tests for days_to_ics
#TODO: Tests for time_struct_to_datetime
#TODO: Tests for build_datetime
#TODO: Tests for datetime_to_string

#TODO: Tests for IcsGenerator
#TODO: Tests for create_course
#TODO: Tests for add_courses_to_calendar
#TODO: Tests for add_courses_to_calendar

