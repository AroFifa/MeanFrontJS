import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { CommissionService } from "app/modules/admin/Management/service/commission/commission.service";
import { ServiceService } from "app/modules/admin/Management/service/service.service";
import { forkJoin } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ServiceResolver implements Resolve<any>{
    constructor( private commissionService: CommissionService,private serviceService: ServiceService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return forkJoin([
            this.commissionService.get(),
            this.commissionService.getHistory(),
            this.serviceService.getAll(1,10)
        ])    }
    
}