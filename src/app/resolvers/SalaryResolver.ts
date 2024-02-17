import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { ServiceService } from "app/modules/admin/Management/service/service.service";
import { FrequencyService } from "app/modules/admin/expense/frequency.service";
import { SalaryService } from "app/modules/admin/expense/salary.service";
import { forkJoin } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SalaryResolver implements Resolve<any>{
    constructor( private salaryService: SalaryService,private frequencyService: FrequencyService, private serviceService: ServiceService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return forkJoin([
            this.salaryService.getAll(1,10),
            this.frequencyService.getAll(),
            this.serviceService.getAll(),
        ])    }
    
}