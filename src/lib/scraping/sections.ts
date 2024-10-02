import { Section } from "../definitions";
import { client } from "./scrape";

// TODO: Masters sections
const sections: Section[] = [
    {
        name: "Microtechnique",
        code: "MT",
    },
    {
        name: "Architecture",
        code: "AR",
    },
    {
        name: "Chimie et génie chimique",
        code: "CGC",
    },
    {
        name: "Génie civil",
        code: "GC",
    },
    {
        name: "Génie mécanique",
        code: "GM",
    },
    {
        name: "Génie électrique et électronique",
        code: "EL",
    },
    {
        name: "Informatique",
        code: "IN",
    },
    {
        name: "Ingénierie des sciences du vivant",
        code: "SV",
    },
    {
        name: "Mathématiques",
        code: "MA",
    },
    {
        name: "Physique",
        code: "PH",
    },
    {
        name: "Science et génie des matériaux",
        code: "MX",
    },
    {
        name: "Sciences et ingénierie de l'environnement",
        code: "SIE",
    },
    {
        name: "Systèmes de communication",
        code: "SC",
    },
];

export async function seedSections() {
    await client.sql`BEGIN`;
    await client.sql`
        CREATE TABLE IF NOT EXISTS sections (
            code VARCHAR(255) PRIMARY KEY NOT NULL,
            name VARCHAR(255) NOT NULL
        );
  `;
    await Promise.all(
        sections.map(async (section) => {
            return client.sql`
                INSERT INTO sections (code, name)
                VALUES (${section.code}, ${section.name})
                ON CONFLICT (code) DO NOTHING;
            `;
        }),
    );
    await client.sql`COMMIT`;
}