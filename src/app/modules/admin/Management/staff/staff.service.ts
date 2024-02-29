import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CRUDService } from '../../../../shared/service/CRUDService';
import { CommonService } from '../../../../shared/service/common.service';

@Injectable({
    providedIn: 'root',
})
export class StaffService extends CRUDService {
    constructor(
        private http: HttpClient,
        private _commonService: CommonService,
    ) {
        super(http);
        this.baseUrl = 'staffs';
    }

    getStaffFromService(serviceId: string) {
        let userId = this._commonService.getValue_FromToken('id');
        return this._http.get<any>(
            `${environment.URL_API}/${this.baseUrl}/users/${userId}/services/${serviceId}`,
        );
    }

    // set min to currentdate - 7 days and max current_date
    getAverageWorkHour(data:any = {date_interval: {min: new Date(new Date().setDate(new Date().getDate() - 7)), max: new Date()}}) {
        return this._http.post<any>(
            `${environment.URL_API}/dashboard/staff-stats`,data
        );
    }
}
