import { Injectable } from '@angular/core';
import { CRUDService } from '../../../../shared/service/CRUDService';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class WorkHourService extends CRUDService {
    constructor(private http: HttpClient) {
        super(http);
        this.baseUrl = 'workHours';
    }
}
