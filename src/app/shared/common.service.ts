import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    getValue_FromToken(fieldName: string) {
        let token = localStorage.getItem('accessToken');
        let decoded = jwtDecode(token);
        return decoded[fieldName];
    }
}
