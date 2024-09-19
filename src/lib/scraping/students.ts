import puppeteer, { Page, TimeoutError } from 'puppeteer';
import { client } from "./scrape";

const years = [
    // TODO: MAN + Masters of other sections
    "BA1",
    "BA2",
    "BA3",
    "BA4",
    "BA5",
    "BA6",
    "MA1",
    "MA2",
    "MA3",
    "MA4",
];

export async function scrapeEleves() {
    await client.sql`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            email_id VARCHAR(255) UNIQUE NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            year VARCHAR(255) NOT NULL,
            section VARCHAR(255) REFERENCES sections(code)
        );
  `;
    const data = await client.sql`SELECT * FROM sections`;
    const sections = data.rows.map(section => section.code);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
        for (let yearIndex = 0; yearIndex < years.length; yearIndex++) {
            const currentSection = sections[sectionIndex];
            const currentYear = years[yearIndex];
            await scrapeVole(page, currentSection, currentYear);
        }
    }
    browser.close();
    console.log('Finished scraping all students!');
}

async function scrapeVole(page: Page, section: string, year: string) {
    console.log(`Scraping ${section}-${year}...`);
    await client.sql`BEGIN`;
    await page.goto(`https://search.epfl.ch/?filter=unit&q=${section}-${year}`);
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
                INSERT INTO students (email_id, first_name, last_name, year, section)
                VALUES (${student.email_id}, ${student.first_name}, ${student.last_name}, ${year}, ${section})
                ON CONFLICT (email_id) DO NOTHING;
            `;
        }),
    );
    await client.sql`COMMIT`;
    console.log(`Scraped ${section}-${year}.`);
}