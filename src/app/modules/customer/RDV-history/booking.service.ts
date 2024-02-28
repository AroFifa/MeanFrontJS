import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from 'app/shared/service/CRUDService';
import { environment } from 'app/environments/environment';
import { CommonService } from 'app/shared/service/common.service';

@Injectable({
    providedIn: 'root',
})
export class BookingService extends CRUDService {
    ownHttpClient: HttpClient;
    customerId: string;

    constructor(private http: HttpClient,private _commonService: CommonService) {
        super(http);
        this.ownHttpClient = http;
        this.baseUrl = 'bookings';
        this.customerId = this._commonService.getValue_FromToken('id');

    }

    getHistory(
        page: number = null,
        itemsPerPage: number = null,
        data : any = {startDate_interval: {max: new Date()}},
    ) {
        let params = [
            page ? `page=${page}` : '',
            itemsPerPage ? `size=${itemsPerPage}` : ''        ]
            .filter(Boolean)
            .join('&');

        let url = `${environment.URL_API}/${this.baseUrl}/history${
            params ? '?' + params : ''
        }`;

        const body = {...data,customerId:this.customerId};

        return this._http.post<any>(url, body);
    }

}
