
export interface Family {
    id?: string;
    name?: string;
    lastUpdate?: number;
}

export interface PersonFamily {
    personId?: string;
    familyId?: string;
    tag?: string;
    lastUpdate?: number;
}
