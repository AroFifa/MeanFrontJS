import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from 'app/shared/service/CRUDService';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SalaryService extends CRUDService {
    constructor(private http: HttpClient) {
        super(http);
        this.baseUrl = 'salaries';
    }

    // override delete function
    delete(id: string) : Observable<any> {
        throw new Error('Method not implemented.');
    }
}
