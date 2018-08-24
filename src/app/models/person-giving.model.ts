export interface GivingBatch {
    Id?: string;
    name?: string;
    amount?: number;
    recieved?: Date;
    created?: Date;
}

interface Records {
    tag?: string;
    person?: string;
    category?: string;
    amount?: number;
    notes?: string;
}

export interface Giving {
    Id?: string;
    batch?: string;
    givingDate?: Date; // date of transaction
    qryGivingDate?: number;
    data?: Records;
    updatedAt?: any; // date of giving
}
