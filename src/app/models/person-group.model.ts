
export interface PersonGroup {
    Id: string;
    name: string;
    leader: string;
    address: Address;
    schedule: Schedule;
    updatedAt: any;
}

interface Address {
    city: string;
    state: string;
}

interface Schedule {
    meetingDays: string;
    meetingTime: string;
}
