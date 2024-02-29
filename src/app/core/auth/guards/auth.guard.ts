import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree,
} from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CommonService } from '../../../shared/service/common.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _commonService: CommonService,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): boolean {
        let token = localStorage.getItem('accessToken');
        if (!token || this._commonService.tokenExpired()) {
            this._router.navigate(['sign-in']).then();
            return false;
        }

        let userType = this._commonService.getValue_FromToken('userType');
        if (!userType) this._router.navigate(['']).then();
        if (state.url.split('/')[1] !== userType.toLowerCase())
            this._commonService.handleRedirection();

        return true;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param segments
     * @private
     */
    private _check(segments: UrlSegment[]): Observable<boolean | UrlTree> {
        // Check the authentication status
        return this._authService.check().pipe(
            switchMap((authenticated) => {
                // If the user is not authenticated...
                if (!authenticated) {
                    // Redirect to the sign-in page with a redirectUrl param
                    const redirectURL = `/${segments.join('/')}`;
                    const urlTree = this._router.parseUrl(redirectURL);
                    // const urlTree = this._router.parseUrl(`sign-in?redirectURL=${redirectURL}`);

                    return of(urlTree);
                }

                // Allow the access
                return of(true);
            }),
        );
    }

    public isLoggedIn(): boolean {
        return localStorage.getItem('IsLoggedIn') == 'true';
    }
}
