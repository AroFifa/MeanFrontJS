import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from 'app/shared/service/CRUDService';
import { Observable } from 'rxjs';
import { environment } from 'app/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SalaryService extends CRUDService {
    ownHttp: HttpClient;
    constructor(private http: HttpClient) {
        super(http);
        this.ownHttp = http;
        this.baseUrl = 'salaries';
    }

    // override delete function
    delete(id: string) : Observable<any> {
        throw new Error('Method not implemented.');
    }

    search(page?: number, itemsPerPage?: number, query?: string, data?: {}): Observable<any> {
        let params = [
            page ? `page=${page}` : '',
            itemsPerPage ? `size=${itemsPerPage}` : '',
            query 
          ].filter(Boolean).join('&');
          
          
          let url = `${environment.URL_API}/${this.baseUrl}/search/by${params ? '?' + params : ''}`;
          
          return this.ownHttp.post<any>(url,data);
    }


    create(data: any) {
        return this.ownHttp.put<any>(
            `${environment.URL_API}/${this.baseUrl}/multiple-update`,
            data,
        );
    }

}
