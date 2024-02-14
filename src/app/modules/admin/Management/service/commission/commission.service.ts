import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'app/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommissionService  {
    baseUrl: string;
    constructor(private _http: HttpClient) {
        this._http = _http;
        this.baseUrl = 'commissions';
    }

    get() {
        return this._http.get<any>(
            `${environment.URL_API}/${this.baseUrl}`,
        );
    }
    getHistory() {
        return this._http.get<any>(
            `${environment.URL_API}/${this.baseUrl}/history`,
        );
    }

    update(data: any) {
        return this._http.put<any>(
            `${environment.URL_API}/${this.baseUrl}`,
            data
        );
    }

}
