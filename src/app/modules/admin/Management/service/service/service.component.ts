import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'app/environments/environment';
import { ServiceService } from '../service.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ShareComponent } from 'app/shared/Component/ShareComponent';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationComponent } from 'app/modules/Common/confirmation/confirmation.component';
import { ServiceEditComponent } from './service-edit/service-edit.component';
import { ServiceCreationComponent } from './service-creation/service-creation.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent extends ShareComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: any;
  services: any;
  serviceFilterOptions: any;

  totalItems = 0;
  itemsPerPage = 10;  
  itemsPerPageOptions = [5, 10, 20, 50];
  page = 1;

  URL_API = environment.URL_API;
  displayedColumns: string[] = [
        'name',
        'description',
        'price',
        'duration',
        'edit',
        'delete',
  ];


  constructor(
    private route: ActivatedRoute,        
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _serviceService: ServiceService

  ){
    super();
  }


  initForm(){
    this.form = this._formBuilder.group({
        name: [''],
        min_price: [this.serviceFilterOptions.price.min,[Validators.min(this.serviceFilterOptions.price.min),Validators.max(this.serviceFilterOptions.price.max)]],
        max_price: [this.serviceFilterOptions.price.max,[Validators.min(this.serviceFilterOptions.price.min),Validators.max(this.serviceFilterOptions.price.max)]],
        min_duration: [this.serviceFilterOptions.duration.min,[Validators.min(this.serviceFilterOptions.duration.min),Validators.max(this.serviceFilterOptions.duration.max)]],
        max_duration: [this.serviceFilterOptions.duration.max,[Validators.min(this.serviceFilterOptions.duration.min),Validators.max(this.serviceFilterOptions.duration.max)]],
    })
}
  ngOnInit(){

    this.services = this.route.snapshot.data['initialData'][2].data;

    this.serviceFilterOptions = this.services.options;

    
    this.dataSource = new MatTableDataSource<any>(this.services.services.items);

    this.dataSource.sort = this.sort;
    this.totalItems = this.services.services.pagination.totalItems;

    this.initForm();    
    this.form.valueChanges.subscribe((formValues) => {
      const name = formValues.name;
      const min_price = formValues.min_price;
      const max_price = formValues.max_price;
    
      const body = {
        price_interval: {
          min: min_price,
          max: max_price
        }
      }
      // Now you can call syncData with these values
      this.syncData(`q=${name}`, body);
    });
    
  }



  syncData (query = null,data={}){
    
    this._serviceService
         .search(this.page,this.itemsPerPage,query,data)
         .subscribe(
          (data) =>{
            this.dataSource = new MatTableDataSource<any>(data.data.services.items);
            this.totalItems = data.data.services.pagination.totalItems;
            this.dataSource.sort = this.sort;

            
          }
          
         )


         

  }
// how to always check if the form.name is changed



  pageChanged(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;

    
    
    this.syncData();
  }


  addService() {
    this._matDialog
        .open(
            ServiceCreationComponent, {
              width: '900px',
          }
        )
        .afterClosed()
        .subscribe(() => {
            this.syncData();
        });
}

updateService(service: any) {
    this._matDialog
        .open(ServiceEditComponent, {
            width: '900px',
            data: { service },
            
        })
        .afterClosed()
        .subscribe(() => {
            this.syncData();
        });
}

deleteService(service:any) {
    this._matDialog
        .open(ConfirmationComponent, {
            data: {
                type: 'delete',
                message: `Voulez vous supprimez ce service:  "${service.name}"? `,
            },
        })
        .afterClosed()
        .subscribe((response) => {
            if (response) {
                this._serviceService
                    .delete(service._id)
                    .subscribe(() => this.syncData());
            }
        });
}
}
