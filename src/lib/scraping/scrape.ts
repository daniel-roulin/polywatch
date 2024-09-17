import { db } from '@vercel/postgres';
import { seedSections } from './sections';

export const client = await db.connect();

export async function scrape() {
    try {
        await client.sql`BEGIN`;
        await seedSections();

        // TODO: Other tables + Use more natural keys

        await client.sql`COMMIT`;
        console.log("Database seeded successfully");
    } catch (error) {
        await client.sql`ROLLBACK`;
        console.error(
            'An error occurred while attempting to seed the database:',
            error,
          );
        throw error;
    }
}