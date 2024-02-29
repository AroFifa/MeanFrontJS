import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from 'app/shared/service/CRUDService';
import { Observable } from 'rxjs';
import { environment } from 'app/environments/environment';
import { CommonService } from 'app/shared/service/common.service';

@Injectable({
    providedIn: 'root',
})
export class UserPreferencesService {
    
    baseUrl: string;
    userId: string;
    constructor(private _http: HttpClient,private _commonService: CommonService) {
        this._http = _http;
        this.baseUrl = 'preferences';
        this.userId = this._commonService.getValue_FromToken('id');
    }


    // getRatings(
    //     entity : 'services' | 'employees',page: number = null, itemsPerPage: number = null,query: string = null,data= {}) {
    //         let params = [
    //             page ? `page=${page}` : '',
    //             itemsPerPage ? `size=${itemsPerPage}` : '',
    //             query,
    //         ]
    //             .filter(Boolean)
    //             .join('&');
    
    //         let url = `${environment.URL_API}/${this.baseUrl}/${entity}${
    //             params ? '?' + params : ''
    //         }`;

            

            
    //         const body = {...data,userId:this.userId};
    
    //         return this._http.post<any>(url, body);
    // }
    // setRating(data:any,entity : 'services' | 'employees') {
    //     const body = {...data,userId:this.userId};
    //     return this._http.put<any>(
    //         `${environment.URL_API}/${this.baseUrl}/${entity}`,
    //         body,
    //     );
    // }



    getRatings(page: number = null, itemsPerPage: number = null,query: string = null,data= {}) {
            let params = [
                page ? `page=${page}` : '',
                itemsPerPage ? `size=${itemsPerPage}` : '',
                query,
            ]
                .filter(Boolean)
                .join('&');
    
            let url = `${environment.URL_API}/${this.baseUrl}${
                params ? '?' + params : ''
            }`;

            

            
            const body = {...data,userId:this.userId};
    
            return this._http.post<any>(url, body);
    }
    setRating(data:any) {
        const body = {...data,userId:this.userId};
        return this._http.put<any>(
            `${environment.URL_API}/${this.baseUrl}`,
            body,
        );
    }
}
