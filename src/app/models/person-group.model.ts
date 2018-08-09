
export interface PersonGroup {
    Id?: string;
    name?: string;
    leader?: string;
    contact?: Contact;
    schedule?: Schedule;
    updatedAt?: any;
}

interface Contact {
    address?: string;
    city?: string;
    state?: string;
}

interface Schedule {
    meetingDays?: string;
    meetingTime?: string;
}
