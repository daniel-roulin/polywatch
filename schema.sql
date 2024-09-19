-- Schema of the data base
-- Temporary file for the creation of scrape.ts and co.

CREATE TABLE IF NOT EXISTS sections (
    code VARCHAR(255) PRIMARY KEY NOT NULL
    nom VARCHAR(255) NOT NULL,
);  

CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email_id VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    year VARCHAR(255) NOT NULL,
    section VARCHAR(255) REFERENCES sections(code)
);

CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS options_classes (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    main BOOLEAN NOT NULL,
    classes_id INTEGER REFERENCES classes(id)
);

CREATE TYPE TYPE_TIMESLOT AS ENUM('classes', 'lab', 'tp', 'exercices', 'projet');

CREATE TABLE IF NOT EXISTS timeslots (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type_timeslot TYPE_TIMESLOT NOT NULL,
    debut INTEGER NOT NULL,
    fin INTEGER NOT NULL,
    semestre INTEGER NOT NULL,
    options_classes_id INTEGER REFERENCES options_classes(id)
);

CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom VARCHAR(255) NOT NULL,
    batiment VARCHAR(255) NOT NULL,
    etage INTEGER NOT NULL,
    lien_plan TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS classes_sections (
    classes_id INTEGER REFERENCES classes(id),
    section_id INTEGER REFERENCES sections(id),
    CONSTRAINT classes_sections_pk PRIMARY KEY (classes_id, section_id)
);

CREATE TABLE IF NOT EXISTS timeslots_rooms (
    timeslot_id INTEGER REFERENCES timeslots(id),
    room_id INTEGER REFERENCES rooms(id),
    CONSTRAINT timeslots_rooms_pk PRIMARY KEY (timeslot_id, room_id)
);
