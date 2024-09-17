import fs from 'fs';
import path from 'path';
import { client } from "./scrape";

const annees = [
    // TODO: MAN
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
]

const stateFilePath = path.join(__dirname, 'state.json');

function readFileIfExists(filePath: string): any | null {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }
    return null;
}

function writeFile(filePath: string, data: any) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function deleteFile(filePath: string): void {
    fs.unlinkSync(filePath);
}

export async function scrapeEleves() {
    const data = await client.sql`SELECT * FROM sections`;
    const sections = data.rows.map(section => section.code);

    const state = readFileIfExists(stateFilePath);
    const lastState = state ? state : null;
    let sectionStart = 0;
    let anneeStart = 0;
    if (lastState) {
        sectionStart = sections.indexOf(lastState.section);
        anneeStart = annees.indexOf(lastState.annee);

        if (sectionStart >= sections.length && anneeStart >= annees.length) {
            console.log('All students have already been scraped!');
            return;
        }

        console.log(`Recovering from ${sectionStart}-${anneeStart}`);
        await client.sql`ROLLBACK`;
    }

    for (let sectionIndex = sectionStart; sectionIndex < sections.length; sectionIndex++) {
        for (let anneeIndex = anneeStart; anneeIndex < annees.length; anneeIndex++) {
            await client.sql`BEGIN`;

            const currentSection = sections[sectionIndex];
            const currentAnnee = annees[anneeIndex];

            scrapeVole(currentSection, currentAnnee); // await new Promise(resolve => setTimeout(resolve, 1000));

            await client.sql`COMMIT`;
            writeFile(stateFilePath, { section: currentSection, annee: currentAnnee });
        }
    }
    deleteFile(stateFilePath);
    console.log('Finished scraping all students!');
}