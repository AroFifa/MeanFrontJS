import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../../models/User';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private _http: HttpClient) {}

    signUp(formData: User) {
        return this._http.post<any>(`${environment.URL_API}/sign-up`, formData);
    }

    signIn(user: User) {
        return this._http.post<any>(`${environment.URL_API}/sign-in`, user);
    }

    checkEmail(email: string) {
        return this._http.post<any>(`${environment.URL_API}/emailExists`, {
            email: email,
        });
    }

    verifiedEmail(userId: string) {
        return this._http
            .get<any>(`${environment.URL_API}/emailVerified?id=${userId}`)
            .subscribe();
    }
}
