import { notFound } from 'next/navigation';
import { scrape } from '@/lib/scraping/scrape';

export async function GET() {
    if (process.env.NODE_ENV === 'production') {
        return notFound();
    }
    try {
        await scrape();
        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}