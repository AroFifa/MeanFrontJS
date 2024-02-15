import { UserType } from './UserType';

export interface User {
    _id?: string;
    name?: string;
    firstName?: string;
    userType: UserType;
    pathImg?: string;
    email: string;
    phoneNumber?: string;
    posts?: any[];
    information?: string;
    password?: string;
    emailVerified?: boolean;
    isDeleted?: boolean;
}
