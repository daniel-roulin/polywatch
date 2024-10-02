
export type Section = {
    name: string;
    code: string;
};

export type Semester = {
    code: string;
    name: string;
    cycle: string;
};

export type Prof = {
    name: string;
    url: string;
};

export type Course = {
    name: string;
    url: string;
    code: string;
    by_section: string;
    prof: Prof[];
    semestres: string[];
    credits: number | null;
    language: string;
};

export type Room = {
    name: string;
    building: string;
    floor: number | null;
    url: string;
};