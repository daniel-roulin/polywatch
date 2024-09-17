import { client } from "./scrape";

const sections = [
    {
        nom: "Microtechnique",
        code: "MT",
    },
    {
        nom: "Architecture",
        code: "AR",
    },
    {
        nom: "Chimie et génie chimique",
        code: "CGC",
    },
    {
        nom: "Génie civil",
        code: "GC",
    },
    {
        nom: "Génie mécanique",
        code: "GM",
    },
    {
        nom: "Génie électrique et électronique",
        code: "EL",
    },
    {
        nom: "Informatique",
        code: "IN",
    },
    {
        nom: "Ingénierie des sciences du vivant",
        code: "SV",
    },
    {
        nom: "Mathématiques",
        code: "MA",
    },
    {
        nom: "Physique",
        code: "PH",
    },
    {
        nom: "Science et génie des matériaux",
        code: "MX",
    },
    {
        nom: "Sciences et ingénierie de l'environnement",
        code: "SIE",
    },
    {
        nom: "Systèmes de communication",
        code: "SC",
    },
];

export async function seedSections() {
    await client.sql`
        CREATE TABLE IF NOT EXISTS sections (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            nom VARCHAR(255) NOT NULL,
            code VARCHAR(255) NOT NULL
    );
  `;

    const insertedSections = await Promise.all(
        sections.map(async (section) => {
            return client.sql`
                INSERT INTO sections (nom, code)
                VALUES (${section.nom}, ${section.code})
                ON CONFLICT (code) DO NOTHING;
            `;
        }),
    );

    return insertedSections;
}