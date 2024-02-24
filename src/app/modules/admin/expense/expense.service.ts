import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from 'app/shared/service/CRUDService';

@Injectable({
    providedIn: 'root',
})
export class ExpenseService extends CRUDService {
    constructor(private http: HttpClient) {
        super(http);
        this.baseUrl = 'expenses';
    }
}
