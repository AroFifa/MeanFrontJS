import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root',
})
export class ConfirmationResolver implements Resolve<any> {
    constructor(private _authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        const id = route.queryParamMap.get('id');
        this._authService.verifiedEmail(id);
        return '';
    }
}
