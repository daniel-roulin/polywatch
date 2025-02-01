import { sql } from "@vercel/postgres";
import { RetrievedCourse, RetrievedRoom, Room, Section, Semester } from "./definitions";


export async function fetchSections() {
    try {
        const data = await sql<Section>`SELECT code, name FROM sections`;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch section data.');
    }
}

export async function fetchSemestres(cycle?: string) {
    try {
        if (cycle === undefined) {
            const data = await sql<Semester>`SELECT * FROM semestres`;
            return data.rows;
        }
        const data = await sql<Semester>`SELECT * FROM semestres WHERE semestres.cycle = ${cycle}`;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch semester data.');
    }
}

export async function fetchCycles() {
    try {
        const data = await sql`SELECT DISTINCT cycle FROM semestres`;
        return data.rows.map((row) => String(row.cycle));
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch cycles data.');
    }
}

export async function fetchRoomByName(name: string) {
    // TODO: Transform all sql`` queries to use the sql.query() method
    // Will avoid many headaches
    try {
        const data = await sql.query<RetrievedRoom>(`SELECT * FROM rooms WHERE rooms.name = $1`, [name]);
        if (data.rows.length > 1) {
            console.error("Too many rooms with name: " + name);
            throw new Error('Too many rooms with name: ' + name);
        }
        return data.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch room data by name.');
    }
}

export async function fetchCourses(semester?: string) {
    try {
        // TODO: Should we separate into fetchCourses and fetchCoursesBySemester?
        if (semester === undefined) {
            const data = await sql<RetrievedCourse>`SELECT * FROM courses`;
            return data.rows;
        }

        // We could also retrieve the section code and name...
        const data = await sql<RetrievedCourse>`
        SELECT 
            courses.id,
            courses.name,
            courses.code,
            courses.url,
            courses.by_section,
            courses.prof,
            courses.language,
            courses.credits
        FROM 
            courses
        JOIN 
            courses_section_semestre ON courses.id = courses_section_semestre.course_id
        JOIN 
            semestres ON courses_section_semestre.semestre_code = semestres.code
        WHERE 
            semestres.code = ${semester}`;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch courses.');
    }
}

export async function fetchCourseByCode(code: string) {
    try {
        const data = await sql<RetrievedCourse>`SELECT * FROM courses WHERE courses.code = ${code}`;
        if (data.rows.length > 1) {
            console.error("Too many courses with code: " + code);
            throw new Error('Too many courses with code: ' + code);
        }
        return data.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch course data by code.');
    }
}