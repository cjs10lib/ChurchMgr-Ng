export interface Visitor {
    Id?:  string;
    title?: string;
    surname?: string;
    firstname?: string;
    othernames?: string;
    fullname?: string;
    gender?: string;
    dob?: Date;
    maritalStatus?: string;
    contact?: Contact;
    occupation?: Occupation;
    invitee?: Invitee;
    beliefs?: Beliefs;
    followUp?: FollowUp;
    created?: Date;
}

interface Contact {
    mobilePhone?: string;
    homePhone?: string;
    email?: string;
    city?: string;
    residentialAddress?: string;
    landMark?: string;
}

interface Occupation {
    jobTitle?: string;
    officePhone?: string;
    officeAddress?: string;
}

interface Invitee {
    personId?: string;
    followshipId?: string;
    inviteMeans?: string;
}

interface Beliefs {
    bornAgain?: string;
    bornAgainDate?: Date;
    becomeMember?: string;
}

interface FollowUp {
    callVisitYou?: string;
    callVisitYouTime?: Date;
    specialCounsel?: string;
    prayerRequest?: string;
}
