-- Schema of the data base
-- Temporary file for the creation of scrape.ts and co.

CREATE TABLE IF NOT EXISTS sections (
    code VARCHAR(255) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL
);  

CREATE TABLE IF NOT EXISTS semestres (
    code VARCHAR(255) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    cycle VARCHAR(255) NOT NULL,
    PRIMARY KEY (letter_code, number)
);
 

CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email_id VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    semester VARCHAR(255) NOT NULL REFERENCES semestres(code),
    section VARCHAR(255) REFERENCES sections(code)
);

CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) UNIQUE NOT NULL,
    url TEXT NOT NULL,
    by_section VARCHAR(255), -- By section does not reference to the sections table because of SHS
    prof TEXT NOT NULL,
    language VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL
);

-- This table links courses, sections and semesters
CREATE TABLE IF NOT EXISTS courses_section_semestre (
    course_id INTEGER REFERENCES courses(id),
    section_code VARCHAR(255) REFERENCES sections(code),
    semestre_code VARCHAR(255) REFERENCES semestres(code),
    PRIMARY KEY (course_id, section_code, semestre_code)
);

CREATE TYPE TYPE_TIMESLOT AS ENUM('courses', 'lab', 'tp', 'exercices', 'projet');

CREATE TABLE IF NOT EXISTS timeslots (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type_timeslot TYPE_TIMESLOT NOT NULL,
    debut INTEGER NOT NULL,
    fin INTEGER NOT NULL,
    semestre INTEGER NOT NULL,
    options_courses_id INTEGER REFERENCES options_courses(id)
);

CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    building VARCHAR(255) NOT NULL,
    floor INTEGER, -- The floor if we can parse it
    url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS timeslots_rooms (
    timeslot_id INTEGER REFERENCES timeslots(id),
    room_id INTEGER REFERENCES rooms(id),
    CONSTRAINT timeslots_rooms_pk PRIMARY KEY (timeslot_id, room_id)
);
