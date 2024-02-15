import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export class CRUDService {
    baseUrl: string;

    constructor(private _http: HttpClient) {
        this._http = _http;
    }

    create(data: any) {
        return this._http.post<any>(
            `${environment.URL_API}/${this.baseUrl}`,
            data,
        );
    }

    update(id: string, data: any) {
        return this._http.put<any>(
            `${environment.URL_API}/${this.baseUrl}/${id}`,
            data,
        );
    }

    getAll(page: number = null, itemsPerPage: number = null) {
        let params = [
            page ? `page=${page}` : '',
            itemsPerPage ? `size=${itemsPerPage}` : ''
          ].filter(Boolean).join('&');
          
          let url = `${environment.URL_API}/${this.baseUrl}${params ? '?' + params : ''}`;
          
          return this._http.get<any>(url);
          
    }

    getOne(id: string) {
        return this._http.get<any>(
            `${environment.URL_API}/${this.baseUrl}/${id}`,
        );
    }

    delete(id: string) {
        return this._http.delete<any>(
            `${environment.URL_API}/${this.baseUrl}/${id}`,
        );
    }
}
