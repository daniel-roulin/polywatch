import { db } from '@vercel/postgres';
import { seedSections } from './sections';
import { scrapeEleves } from './students';
import { seedSemestres } from './semesters';
import { scrapeCourses } from './courses';
import { scrapeRooms } from './rooms';
import { scrapePeriods } from './period';

// TODO: Does having a client objet makes sense?
export const client = await db.connect();

// TODO: Decide if we want to keep the IF NOT EXISTS and the ON CONFLICT
// TODO: clear the database before seeding?
// TODO: Try to use Promise.all in here and when when use for of loops to speed things up

export async function scrape() {
    try {

        // await seedSections();
        // await seedSemestres();
        // await scrapeRooms();

        // await scrapeEleves();
        // await scrapeCourses();
        await scrapePeriods();

        // The Moodle links all have the same structure: https://go.epfl.ch/MICRO-313

        // TODO: Release the client + all of the browsers 

        console.log("Database seeded successfully");
    } catch (error) {
        console.error(
            'An error occurred while attempting to seed the database:',
            error,
          );
        throw error;
    }
}