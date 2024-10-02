import puppeteer, { Page, TimeoutError } from 'puppeteer';
import { client } from "./scrape";
import { fetchSections, fetchSemestres } from '../data';
import { Section, Semester } from '../definitions';

export async function scrapeEleves() {
    await client.sql`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            email_id VARCHAR(255) UNIQUE NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            semester VARCHAR(255) NOT NULL REFERENCES semestres(code),
            section VARCHAR(255) REFERENCES sections(code)
        );
  `;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const [sections, semesters] = await Promise.all([fetchSections(), fetchSemestres()]);

    for (const section of sections) {
        for (const semestere of semesters) {
            await scrapeVole(page, section, semestere);
        }
    }

    browser.close();
    console.log('Finished scraping all students!');
}

async function scrapeVole(page: Page, section: Section, semester: Semester) {
    console.log(`Scraping ${section.code}-${semester.code}...`);
    await client.sql`BEGIN`;
    await page.goto(`https://search.epfl.ch/?filter=unit&q=${section.code}-${semester.code}`);
    try {
        await page.waitForSelector('.table.result__table', {timeout: 5000});
    } catch (error) {
        if (error instanceof TimeoutError) {
            console.log("No students found.");
        } else {
            throw error;
        }
    }
    const students = await page.$$eval('.result__table tbody tr', rows => {
        return rows.map(row => {
            const anchor = row.querySelector('td a');
            if (!anchor || !anchor.textContent) {
                throw new Error("Could not find the student row!")
            }

            const link = anchor.getAttribute('href');
            if (!link) {
                throw new Error("Could not find the student link!")
            }
            const fullName = anchor.textContent.trim();
            const [lastName, firstName] = fullName.split(', ').map(part => part.trim());
            const emailId = link.split('/').pop();
            return { first_name: firstName, last_name: lastName, email_id: emailId };
        });
    });
    await Promise.all(
        students.map(async (student) => {
            return client.sql`
                INSERT INTO students (email_id, first_name, last_name, semester, section)
                VALUES (${student.email_id}, ${student.first_name}, ${student.last_name}, ${semester.code}, ${section.code})
                ON CONFLICT (email_id) DO NOTHING;
            `;
        }),
    );
    await client.sql`COMMIT`;
    console.log(`Scraped ${section}-${semester}.`);
}