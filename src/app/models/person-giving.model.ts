export interface GivingBatch {
    Id?: string;
    name?: string;
    amount?: number;
    recieved?: Date;
    created?: Date;
}

interface Records {
    personId?: string;
    category?: string;
    amount?: number;
    notes?: string;
}

export interface Giving {
    Id?: string;
    batch?: string;
    records?: Records;
}
