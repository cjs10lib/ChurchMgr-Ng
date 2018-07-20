
export interface Person {
    id?: string;
    title?: string;
    surname?: string;
    firstname?: string;
    otherNames?: string;
    fullname?: string;
    gender?: string;
    dob?: Date;
    maritalStatus?: string;
    ethnicity?: string;
    education?: Education;
    occupation?: Work;
    contact?: Contact;
    home?: Home;
    createdDate?: Date;
}

interface Home {
    city?: string;
    state?: string;
}

interface Contact {
    mobilePhone1?: number;
    mobilePhone2?: number;
    homePhone?: number;
    email?: string;
    city?: string;
    zip?: number;
    residentialAddress?: string;
}

interface Work {
    occupation?: string;
    employer?: string;
    department?: string;
    post?: string;
    phone?: number;
    telephone?: number;
    address?: string;
}

interface Education {
    highestEducationLevel?: string;
    certification?: string;
    school?: string;
    grade?: string;
}

