import { sql } from "@vercel/postgres";
import { Section, Semester } from "./definitions";


export async function fetchSections() {
    try {
        const data = await sql<Section>`SELECT code, name FROM sections`;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
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
        throw new Error('Failed to fetch revenue data.');
    }
}

export async function fetchCycles() {
    try {
        const data = await sql`SELECT DISTINCT cycle FROM semestres`;
        return data.rows.map((row) => String(row.cycle));
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
    }
}