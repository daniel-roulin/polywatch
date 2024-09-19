import { db } from '@vercel/postgres';
import { scrapeSections } from './sections';
import { scrapeEleves } from './students';

export const client = await db.connect();

export async function scrape() {
    try {
        // await scrapeSections();
        await scrapeEleves();

        // TODO: Other tables

        console.log("Database seeded successfully");
    } catch (error) {
        console.error(
            'An error occurred while attempting to seed the database:',
            error,
          );
        throw error;
    }
}