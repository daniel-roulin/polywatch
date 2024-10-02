import { CheerioAPI } from 'cheerio';
import * as cheerio from 'cheerio';
import { Course, Section, Semester } from '../definitions';
import { client } from './scrape';
import { fetchCycles, fetchSections, fetchSemestres } from '../data';
import { normalize } from '../utils';


export async function scrapeCourses() {
    await client.sql`
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(255) UNIQUE NOT NULL,
            url TEXT NOT NULL,
            by_section VARCHAR(255),
            prof TEXT NOT NULL,
            language VARCHAR(255) NOT NULL,
            credits INTEGER
        );
    `;

    // This table links courses to the semesters they are given in and 
    // the section they are given to.
    await client.sql`
        CREATE TABLE IF NOT EXISTS courses_section_semestre (
            course_id INTEGER REFERENCES courses(id),
            section_code VARCHAR(255) REFERENCES sections(code),
            semestre_code VARCHAR(255) REFERENCES semestres(code),
            PRIMARY KEY (course_id, section_code, semestre_code)
        );
    `;

    const sections = await fetchSections();
    const cycles = await fetchCycles();
    for (const section of sections) {
        for (const cycle of cycles) {
            await scrapeCourse(section, cycle);
        }
    }
}

async function scrapeCourse(section: Section, cycle: string) {
    console.log(`Scrapping ${cycle.toLowerCase()} courses of ${section.name}...`);

    const base_url = 'https://edu.epfl.ch';
    const url = `${base_url}/studyplan/fr/${normalize(cycle)}/${normalize(section.name)}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    let courses: Course[] = [];
    const studyPlans = $('.study-plan');
    for (const bloc of studyPlans) {
        const lines = $(bloc).find('.line-down');
        for (const line of lines) {
            // Nom et URL
            const course_element = $(line).find('.cours-name a');
            const course_name = course_element.text();
            const course_url = base_url + course_element.attr('href');

            // Code du cours et section donnant le cours
            const info = $(line).find('.cours-info').text();
            const [code_part, section_part] = info.split(' / ');
            const cours_code = code_part.trim();
            const section_match = section_part.match(/Section (\w+)/);
            let section_cours;
            if (section_match) {
                section_cours = section_match[1].trim();
            } else {
                throw new Error("Invalid format: Section not found");
            }
            
            // TODO: Manually add SHS courses
            // Skip courses without code
            if (cours_code == "") {
                continue;
            }

            // Prof(s)
            // IDEE: Ajouter une table prof à la db
            const prof_element = $(line).find('.enseignement-name');
            const prof = prof_element.find('a').map((i, element) => ({
                name: $(element).text(),
                url: base_url + $(element).attr('href'),
            })).toArray();

            // Semestres ou est donné le cours
            const all_semesters = await fetchSemestres(cycle);
            const semesters = await parseSemesters($, line, cycle, all_semesters);

            // Nombre de crédits du cours
            const credits_element = $(line).find('[data-title="Crédits"] .credit-time');
            let credits: number | null = parseInt(credits_element.text().trim());
            if (isNaN(credits)) {
                credits = null;
            }

            // Langue
            const language_element = $(line).find('[data-title="Langue"] .langue abbr');
            const language = language_element.text().trim();

            courses.push({
                name: course_name,
                url: course_url,
                code: cours_code,
                by_section: section_cours,
                prof: prof,
                semestres: semesters,
                credits: credits,
                language: language,
            });
        }
    }

    // console.log(courses);

    await client.sql`BEGIN`;
    await Promise.all(
        courses.map(async (course) => {
            // Insert courses into the database
            const result = await client.sql`
                INSERT INTO courses (
                    name,
                    code,
                    url,
                    by_section,
                    prof,
                    language,
                    credits
                )
                VALUES (
                    ${course.name},
                    ${course.code},
                    ${course.url},
                    ${course.by_section},
                    ${JSON.stringify(course.prof)},
                    ${course.language},
                    ${course.credits}
                )
                ON CONFLICT (code) DO NOTHING
                RETURNING id;
            `;

            let course_id = result.rows[0]?.id;
            if (!course_id) {
                console.log(`Course with code ${course.code} already exists.`);

                const result = await client.sql`SELECT id FROM courses WHERE code = ${course.code}`;
                course_id = result.rows[0]?.id;
                if (!course_id) {
                    throw new Error(`Course with code ${course.code} not found.`);
                }
            }

            // Insert the course into the junction table
            await Promise.all(
                course.semestres.map(async (semester) => {
                    return client.sql`
                        INSERT INTO courses_section_semestre (
                            course_id,
                            section_code,
                            semestre_code
                        )
                        VALUES (
                            ${course_id},
                            ${section.code},
                            ${semester}
                        )
                        ON CONFLICT (course_id, section_code, semestre_code) DO NOTHING;
                    `;
                })
            );
        }),
    );
    await client.sql`COMMIT`;

    console.log(`Scraped ${cycle.toLowerCase()} courses of ${section.name}`);
}

async function parseSemesters($: CheerioAPI, line: any, cycle: string, all_semesters: Semester[]) {
    let semesters = [];
    let degreeLevel = cycle;
    if (cycle == "Propédeutique") {
        degreeLevel = "Bachelor";
    }
    for (const semester of all_semesters) {
        const semester_number = semester.code.slice(-1);
        const bachelor_object = $(line).find(`[data-title="${degreeLevel} ${semester_number}"]`);
        if (inBachelor($, bachelor_object)) {
            semesters.push(semester.code);
        }
    }
    return semesters;
}

function inBachelor($: CheerioAPI, bachelor_object: any) {
    const cells = $(bachelor_object).find('.cep');
    let isInBachelor = false;
    cells.each((i, element) => {
        const content = $(element).text().trim();
        if (content !== "-") {
            isInBachelor = true;
            return false;
        }
    });
    return isInBachelor;
}