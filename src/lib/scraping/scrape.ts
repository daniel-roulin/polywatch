import { db } from '@vercel/postgres';
import { seedSections } from './sections';
import { scrapeEleves } from './students';
import { seedSemestres } from './semesters';
import { scrapeCourses } from './courses';
import { scrapeAllRooms } from './rooms';

// TODO: Does having a client objet makes sense?
export const client = await db.connect();

export async function scrape() {
    try {
        // await seedSections();
        // await seedSemestres();
        // await scrapeEleves();
        // await scrapeCourses();
        // TODO: timeslots and rooms
        await scrapeAllRooms();

        // Do we find the rooms directly or infer them from the courses?

        console.log("Database seeded successfully");
    } catch (error) {
        console.error(
            'An error occurred while attempting to seed the database:',
            error,
          );
        throw error;
    }
}