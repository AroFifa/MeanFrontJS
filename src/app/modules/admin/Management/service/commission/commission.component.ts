import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'app/environments/environment';
import { ShareComponent } from 'app/shared/ShareComponent';
import { CommissionService } from './commission.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from 'app/modules/Common/confirmation/confirmation.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss']
})
export class CommissionComponent extends ShareComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalItems = 0;
  itemsPerPage = 10;  
  page = 1;

  @ViewChild(MatSort) sort: MatSort;
  // commission history 
  isDisabled:boolean = true;
  commissionHistory : any;
  dataSource: any;
  URL_API = environment.URL_API;
  displayedColumns: string[] = [
    'commissionRate',
    'creationDate',
  ];
  // actual value of the commission
  commission: any;

  constructor(
    private route: ActivatedRoute,        
    private _matDialog: MatDialog,
    private _commissionService: CommissionService

  ){
    super();
  }

  ngOnInit(){

    
    this.commission = this.route.snapshot.data['initialData'][0].data;
    this.commissionHistory = this.route.snapshot.data['initialData'][1].data;
    
    this.dataSource = new MatTableDataSource<any>(this.commissionHistory.items);
    this.totalItems = this.commissionHistory.pagination.totalItems;
    
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  syncData (){
    this._commissionService
         .getHistory(this.page,this.itemsPerPage)
         .subscribe(
          (data) =>{
            this.dataSource = new MatTableDataSource<any>(data.data.items);
            this.totalItems = data.data.pagination.totalItems;
            this.dataSource.sort = this.sort;

            
          }
          
         )


         

    this._commissionService
    .get()
    .subscribe(
     (item) =>
       (this.commission = item.data)
    )
  }



  // function to handle commissionRateInput change event 
  editCommissionRate(){
    this.isDisabled= false;
  }
  cancelEditCommissionRate(){
    
    this.isDisabled = true;
  }


  updateCommission(event:any) {
    this._matDialog
        .open(ConfirmationComponent, {
            data: {
                type: 'info',
                message: `Voulez vous modifier le taux de commission des services en ${event.target.value}% ?`,
            },
        })
        .afterClosed()
        .subscribe((response) => {
            if (response) {
                this._commissionService
                    .update({commissionRate: event.target.value})
                    .subscribe(() => {this.syncData()});
            }            
            this.isDisabled = true;

        });
  }
  pageChanged(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;

    
    
    this.syncData();
  }

}
