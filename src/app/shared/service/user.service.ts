import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, ReplaySubject, tap } from 'rxjs';
import { User } from '../../models/User';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from './CRUDService';

@Injectable({
    providedIn: 'root',
})
export class UserService extends CRUDService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(null);

    /**
     * Constructor
     */
    constructor(private http: HttpClient) {
        super(http);
        this.baseUrl = 'users';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }
}
