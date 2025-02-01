
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

export type RetrievedCourse = Course & {
    id: number;
};

export type Room = {
    name: string;
    building: string;
    floor: number | null;
    url: string;
};

export type RetrievedRoom = Course & {
    id: number;
};

export type Period = {
    day_of_week: number;
    start_time: number;
    end_time: number;
    type: string | null;
    room_names: string[];
  }