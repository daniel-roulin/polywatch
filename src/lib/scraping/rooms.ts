import { client } from './scrape';
import * as cheerio from 'cheerio';

export async function scrapeAllRooms() {
    await client.sql`
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            name VARCHAR(255) NOT NULL,
            building VARCHAR(255) NOT NULL,
            floor INTEGER, -- The floor if we can parse it
            url TEXT NOT NULL
        );
    `;

    const buildings = await scrapeBuildings();

    for (const building of buildings) {
        await scrapeRooms(building);
    }

    // TODO: Scrape floor information from the room pages if they are null
    // Too many requests, information is not that valuable
    // We can always do it when requested and cache the results
}

async function scrapeBuildings() {
    const response = await fetch("https://plan.epfl.ch/buildings.html");
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const buildings: string[] = $('ul.list li a')
        .map((_, element) => $(element).text().trim())
        .toArray();
    return buildings;
}

async function scrapeRooms(building: string) {
    const response = await fetch(`https://plan.epfl.ch/buildings/${building}.html`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const rooms = $('ul.list li a')
        .map((_, element) => {
            const name = $(element).text().trim();
            const url = $(element).attr('href');
            const floor = extractFloor(name);
            if (!url) {
                throw new Error("Could not find the room URL!");
            }
            return { name, building, floor, url };
        })
        .toArray();

    await Promise.all(
        rooms.map(room => {
            return client.sql`
                INSERT INTO rooms (name, building, floor, url)
                VALUES (${room.name}, ${room.building}, ${room.floor}, ${room.url})
            `;
        })
    )

    console.log(`Scrapped ${rooms.length} rooms in ${building}`);
}

function extractFloor(roomName: string): number | null {
    // Regular expression to match the desired format
    const regex = /^[A-Za-z0-9.,]+ (-?\d+) [A-Za-z0-9.,]+$/;

    // Attempt to match the room name to the pattern
    const match = roomName.match(regex);

    // If there's a match, return the floor number (second part), else return null
    return match ? parseInt(match[1], 10) : null;
}

function scrapeFloor() {
    // TODO: One day
    // The idea would be to load the link, wait for redirects and check the url
    // Maybe we can disable some endpoints to avoid too many requests
}