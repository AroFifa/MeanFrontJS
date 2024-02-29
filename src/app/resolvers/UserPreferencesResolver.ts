import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserPreferencesService } from 'app/modules/customer/Preferences/user-preferences.service';
import { ServiceService } from 'app/modules/admin/Management/service.service';

@Injectable({
    providedIn: 'root',
})
export class UserPreferencesResolver implements Resolve<any> {
    constructor(
        private userPreferencesService: UserPreferencesService,
    ) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return forkJoin([
            this.userPreferencesService.getRatings(1, 10)
        ]);
    }
}


// @Injectable({
//     providedIn: 'root',
// })
// export class ServicePreferencesResolver implements Resolve<any> {
//     constructor(
//         private userPreferencesService: UserPreferencesService,
//     ) {}
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//         return forkJoin([
//             this.userPreferencesService.getRatings("services",1, 10),
//         ]);
//     }
// }


// @Injectable({
//     providedIn: 'root',
// })
// export class EmployeePreferencesResolver implements Resolve<any> {
//     constructor(
//         private userPreferencesService: UserPreferencesService,
//         private serviceService: ServiceService,
//     ) {}
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//         return forkJoin([
//             this.userPreferencesService.getRatings("employees",1, 10),
//             this.serviceService.getAll(),
//         ]);
//     }
// }
