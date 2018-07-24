
export interface Family {
    id?: string;
    name?: string;
    lastUpdate?: number;
}

export interface PersonFamily {
    familyId?: string;
    tag?: string;
    lastUpdate?: number;
}

export interface FamilyMembers {
    personId?: string;
    familyId?: string;
    personTag?: string;
    lastUpdate?: Date;
}
