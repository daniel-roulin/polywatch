-- Schema of the data base
-- Temporary file for the creation of scrape.ts and co.
CREATE TABLE
    IF NOT EXISTS sections (
        code VARCHAR(255) PRIMARY KEY NOT NULL,
        name VARCHAR(255) NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS semestres (
        code VARCHAR(255) PRIMARY KEY NOT NULL,
        name VARCHAR(255) NOT NULL,
        cycle VARCHAR(255) NOT NULL,
        PRIMARY KEY (letter_code, number)
    );

CREATE TABLE
    IF NOT EXISTS students (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        email_id VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        semester VARCHAR(255) NOT NULL REFERENCES semestres (code),
        section VARCHAR(255) REFERENCES sections (code)
    );

CREATE TABLE
    IF NOT EXISTS courses (
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
CREATE TABLE
    IF NOT EXISTS courses_section_semestre (
        course_id INTEGER REFERENCES courses (id),
        section_code VARCHAR(255) REFERENCES sections (code),
        semestre_code VARCHAR(255) REFERENCES semestres (code),
        PRIMARY KEY (course_id, section_code, semestre_code)
    );

CREATE TYPE TYPE_PERIOD AS ENUM ('course', 'lab', 'tp', 'exercices', 'projet');

CREATE TABLE
    IF NOT EXISTS periods (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        type TYPE_PERIOD,
        day_of_week INTEGER NOT NULL,
        start_time INTEGER NOT NULL,
        end_time INTEGER NOT NULL,
        course_id INTEGER REFERENCES courses (id)
    );

CREATE TABLE
    IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) UNIQUE NOT NULL,
        building VARCHAR(255),
        floor INTEGER,
        url TEXT
    );

CREATE TABLE
    IF NOT EXISTS periods_rooms (
        period_id INTEGER REFERENCES periods (id),
        room_id INTEGER REFERENCES rooms (id),
        PRIMARY KEY (period_id, room_id)
    );