import { UserType } from './UserType';

export interface User {
    name?: string;
    firstName?: string;
    userType?: UserType;
    pathImg?: string;
    email: string;
    information?: string;
    password?: string;
    emailVerified?: boolean;
    isDeleted?: boolean;
}
