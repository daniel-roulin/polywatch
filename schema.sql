-- Schema of the data base
-- Temporary file for the creation of scrape.ts and co.

-- CREATE TABLE IF NOT EXISTS sections (
--     id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--     nom VARCHAR(255) NOT NULL,
--     code VARCHAR(255) NOT NULL
-- );

CREATE TABLE IF NOT EXISTS eleves (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    annee VARCHAR(255) NOT NULL,
    lien_people TEXT NOT NULL,
    section_id INTEGER REFERENCES sections(id)
);

CREATE TABLE IF NOT EXISTS cours (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS options_cours (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    principal BOOLEAN NOT NULL,
    cours_id INTEGER REFERENCES cours(id)
);

CREATE TYPE TYPE_PERIODE AS ENUM('cours', 'labo', 'tp', 'exercices', 'projet');

CREATE TABLE IF NOT EXISTS periodes (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type_periode TYPE_PERIODE NOT NULL,
    debut INTEGER NOT NULL,
    fin INTEGER NOT NULL,
    semestre INTEGER NOT NULL,
    options_cours_id INTEGER REFERENCES options_cours(id)
);

CREATE TABLE IF NOT EXISTS salles (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom VARCHAR(255) NOT NULL,
    batiment VARCHAR(255) NOT NULL,
    etage INTEGER NOT NULL,
    lien_plan TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cours_sections (
    cours_id INTEGER REFERENCES cours(id),
    section_id INTEGER REFERENCES sections(id),
    CONSTRAINT cours_sections_pk PRIMARY KEY (cours_id, section_id)
);

CREATE TABLE IF NOT EXISTS periodes_salles (
    periode_id INTEGER REFERENCES periodes(id),
    salle_id INTEGER REFERENCES salles(id),
    CONSTRAINT periodes_salles_pk PRIMARY KEY (periode_id, salle_id)
);
