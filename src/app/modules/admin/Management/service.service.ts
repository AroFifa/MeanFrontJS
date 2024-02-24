import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from '../../../shared/service/CRUDService';

@Injectable({
    providedIn: 'root',
})
export class ServiceService extends CRUDService {
    constructor(private http: HttpClient) {
        super(http);
        this.baseUrl = 'services';
    }
}
