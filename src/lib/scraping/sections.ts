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

export async function scrapeSections() {
    await client.sql`BEGIN`;
    await client.sql`
        CREATE TABLE IF NOT EXISTS sections (
            code VARCHAR(255) PRIMARY KEY NOT NULL,
            nom VARCHAR(255) NOT NULL
        );
  `;
    await Promise.all(
        sections.map(async (section) => {
            return client.sql`
                INSERT INTO sections (code, nom)
                VALUES (${section.code}, ${section.nom})
                ON CONFLICT (code) DO NOTHING;
            `;
        }),
    );
    await client.sql`COMMIT`;
}