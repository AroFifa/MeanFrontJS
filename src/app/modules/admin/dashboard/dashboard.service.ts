import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "app/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class DashBoardService {
    
    baseUrl: string;
    constructor(private _http: HttpClient) {
        this._http = _http;
        this.baseUrl = 'dashboard';
    }



    // set min to currentdate - 7 days and max current_date
    getAverageWorkHour(data:any = {date_interval: {min: new Date(new Date().setDate(new Date().getDate() - 7)), max: new Date()}}) {
        return this._http.post<any>(
            `${environment.URL_API}/${this.baseUrl}/staff-stats`,data
        );
    }

    // get daily and monthly booking
    getDailyMonthlyBooking() {
        return this._http.get<any>(
            `${environment.URL_API}/${this.baseUrl}/daily-monthly-booking`
        );
    }
}