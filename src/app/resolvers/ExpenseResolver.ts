import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { ExpenseService } from "app/modules/admin/expense/expense.service";
import { forkJoin } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ExpenseResolver implements Resolve<any>{
    constructor( private expenseService: ExpenseService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return forkJoin([
            this.expenseService.getAll(1,10),
        ])    }
    
}