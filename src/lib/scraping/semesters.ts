import { Semester } from "../definitions";
import { client } from "./scrape";

// TODO: MAN + Master
const semesters: Semester[] = [
    {
        name: "Premier semestre de bachelor",
        code: "BA1",
        cycle: "Propédeutique",
    },
    {
        name: "Deuxième semestre de bachelor",
        code: "BA2",
        cycle: "Propédeutique",
    },
    {
        name: "Troisième semestre de bachelor",
        code: "BA3",
        cycle: "Bachelor",
    },
    {
        name: "Quatrième semestre de bachelor",
        code: "BA4",
        cycle: "Bachelor",

    },
    {
        name: "Cinquième semestre de bachelor",
        code: "BA5",
        cycle: "Bachelor",

    },
    {
        name: "Sixième semestre de bachelor",
        code: "BA6",
        cycle: "Bachelor",
    },
];

export async function seedSemestres() {
    await client.sql`BEGIN`;
    await client.sql`
    CREATE TABLE IF NOT EXISTS semestres (
        code VARCHAR(255) PRIMARY KEY NOT NULL,
        name VARCHAR(255) NOT NULL,
        cycle VARCHAR(255) NOT NULL
    );
  `;
    await Promise.all(
        semesters.map(async (semester) => {
            return client.sql`
                INSERT INTO semestres (code, name, cycle)
                VALUES (${semester.code}, ${semester.name}, ${semester.cycle})
                ON CONFLICT (code) DO NOTHING;
            `;
        }),
    );
    await client.sql`COMMIT`;
}