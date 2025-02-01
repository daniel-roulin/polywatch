import { fetchCourseByCode, fetchCourses, fetchRoomByName } from "../data";
import { Period, RetrievedCourse, RetrievedRoom } from "../definitions";
import { client } from "./scrape";
import * as cheerio from 'cheerio';
// import cli_progress from 'cli-progress';
import prompt_sync from 'prompt-sync';

export async function scrapePeriods() {
    await client.sql`
        DROP TABlE IF EXISTS periods_rooms;
        DROP TABlE IF EXISTS periods;
        DROP TYPE IF EXISTS TYPE_PERIOD;

        CREATE TYPE TYPE_PERIOD AS ENUM ('course', 'lab', 'tp', 'exercices', 'projet');
        CREATE TABLE
            IF NOT EXISTS periods (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                type TYPE_PERIOD,
                day_of_week INTEGER NOT NULL,
                start_time INTEGER NOT NULL,
                end_time INTEGER NOT NULL,
                course_id INTEGER REFERENCES courses (id)
        );
        CREATE TABLE
            IF NOT EXISTS periods_rooms (
                period_id INTEGER REFERENCES periods (id),
                room_id INTEGER REFERENCES rooms (id),
                PRIMARY KEY (period_id, room_id)
        );
    `;

    // TODO: Move all question at the beginning of the script in scrape.ts and handle progress bars there?
    // const container = new cli_progress.MultiBar({
    //     format: "Scraping periods... [{bar}] {percentage}% | {value}/{total} | {eta_formatted} remaining"
    // });
    // const progress_bar = container.create(courses.length, 0);

    let semestres: string[] = [];
    while (true) {
        const input = prompt_sync({ sigint: true })("Which semester do you want to scrape? (1 or 2): ");
        if (input === "1") {
            semestres = ["BA1", "BA3", "BA5"];
            break;
        } else if (input === "2") {
            semestres = ["BA2", "BA4", "BA6"];
            break;
        } else {
            console.log("Invalid input");
        }
    }

    // TODO: Deal with course Introduction à la programmation
    for (const semestre of semestres) {
        const courses = await fetchCourses(semestre);
        for (const course of courses) {
            console.log("Scraping " + course.name);
            await scrapePeriodsFromCourse(course);
        }
    }

    // const course = await fetchCourseByCode("CS-107");
    // await scrapePeriodsFromCourse(course);
}

async function scrapePeriodsFromCourse(course: RetrievedCourse) {
    const day_map: { [key: string]: number } = {
        'Lundi': 1,
        'Mardi': 2,
        'Mercredi': 3,
        'Jeudi': 4,
        'Vendredi': 5,
        'Samedi': 6,
        'Dimanche': 7
    };
    const type_map: { [key: string]: string } = {
        'Cours': 'course',
        'Exercice, TP': 'exercices',
        'Projet, autre': 'projet'
    };
    const response = await fetch(course.url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const periods: Period[] = [];
    $('.coursebook-week-caption.sr-only p').each((_, element) => {
        const text = $(element).text().trim();
        const day_match = text.match(/(Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche)/);
        const time_match = text.match(/(\d{1,2})h\s-\s(\d{1,2})h/);
        const type_match = text.match(/(Cours|Exercice, TP|Projet, autre)/i);
        const room_links = $(element).find('a');
        if (day_match && time_match) {
            const day_of_week = day_map[day_match[1]];
            const start_time = parseInt(time_match[1], 10);
            const end_time = parseInt(time_match[2], 10);

            let type = null;
            if (type_match) {
                type = type_map[type_match[1]];
            } else {
                console.warn(`Did not find type of period ${text} in course ${course.code}: ${course.name}`);
            }

            const room_names: string[] = [];
            room_links.each((_, link_element) => {
                const url = $(link_element).attr('href');
                if (url) {
                    const roomCode = url.split('==')[1];
                    room_names.push(roomCode.trim());
                }
            });

            periods.push({
                type: type,
                day_of_week: day_of_week,
                start_time: start_time,
                end_time: end_time,
                room_names: room_names,
            });
        } else {
            console.error(`Did not find time of period ${text} in course ${course.code}: ${course.name}`);
            throw new Error('Invalid format');
        }
    });

    await Promise.all(
        periods.map(async (period) => {
            const result = await client.sql`
                INSERT INTO periods (
                    type,
                    day_of_week,
                    start_time,
                    end_time,
                    course_id
                )
                VALUES (
                    ${period.type},
                    ${period.day_of_week},
                    ${period.start_time},
                    ${period.end_time},
                    ${course.id}
                )
                RETURNING id;
            `;

            // Insert the periods into the junction table
            let period_id = result.rows[0]?.id;
            await Promise.all(
                period.room_names.map(async (room_name) => {
                    // Using INSERT ... ON CONFLICT to handle room creation atomically
                    const room = await client.sql`
                        INSERT INTO rooms (name)
                        VALUES (${room_name})
                        ON CONFLICT (name) DO UPDATE
                        SET name = EXCLUDED.name
                        RETURNING id;
                    `;
                    const room_id = room.rows[0].id;

                    await client.sql`
                        INSERT INTO periods_rooms (
                            period_id,
                            room_id
                        )
                        VALUES (
                            ${period_id},
                            ${room_id}
                        )
                    `;
                })
            );
        })
    );
}
