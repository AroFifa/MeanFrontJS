import { User } from './User';

export interface WorkHour {
    _id?: string;
    dow: string;
    start: string;
    end: string;
    isDeleted?: boolean;
    employees: User[];
}
