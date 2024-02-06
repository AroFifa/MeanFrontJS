/*export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
}*/

export interface User {
    id?: string;
    firstname?: string;
    username?: string;
    name?: string;
    title?: string;
    email?: string;
    birthDate?: string;
    language?: string;
    lastLogin?: string;
    isDeleted?: boolean;
    avatar?: string;
    postalCode?: string;
}
