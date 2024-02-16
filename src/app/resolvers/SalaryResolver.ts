import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { SalaryService } from "app/modules/admin/expense/salary.service";
import { forkJoin } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SalaryResolver implements Resolve<any>{
    constructor( private salaryService: SalaryService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return forkJoin([
            this.salaryService.getAll(1,10),
        ])    }
    
}