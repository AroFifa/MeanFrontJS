import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'app/environments/environment';
import { ShareComponent } from 'app/shared/ShareComponent';
import { CommissionService } from './commission.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss']
})
export class CommissionComponent extends ShareComponent{

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatInput) commissionRateInput: MatInput;
  // commission history 
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
    private _commissionService: CommissionService

  ){
    super();
  }

  ngOnInit(){

    
    this.commission = this.route.snapshot.data['initialData'][0].data;
    // this.commissionRateInput.value = this.commission.commissionRate;
    // this.commissionRateInput.disabled = true;
    // ^sans pagination
    this.dataSource = new MatTableDataSource<any>(this.route.snapshot.data['initialData'][1].data)
    this.dataSource.sort= this.sort;
  }

  syncData (){
    this._commissionService
         .getHistory()
         .subscribe(
          (items) =>
            (this.dataSource = new MatTableDataSource<any>(items.data))
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
    this.commissionRateInput.disabled = false;
  }
  cancelEditCommissionRate(){
    this.commissionRateInput.disabled = true;
  }
  onCommissionRateChange(){

    this._commissionService.update({commissionRate: this.commissionRateInput.value}).subscribe(
      (data) => {
        if (data.state == 'error') {
          this.alert = {
              type: 'error',
              message: data.message,
          };
          this.handleMessage();
        } else {
            this.commissionRateInput.disabled = true;
            this.syncData();
        }
      }
    )

  }

}
