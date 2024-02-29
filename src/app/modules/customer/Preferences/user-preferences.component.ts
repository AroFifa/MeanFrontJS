import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'app/environments/environment';
import { ShareComponent } from 'app/shared/Component/ShareComponent';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl } from '@angular/forms';
import { UserPreferencesService } from './user-preferences.service';

@Component({
    selector: 'app-user-preferences',
    templateUrl: './user-preferences.component.html',
})
export class UserPreferencesComponent extends ShareComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = [
        'avatar',
        'name',
        'firstname',
        'email',
        'rating'
    ];
    dataSource: any;
    employees: any;

    searchForm = new FormControl('');
    filterQuery = '';

    totalItems = 0;
    itemsPerPage = 10;
    itemsPerPageOptions = [5, 10, 20, 50];
    page = 1;

    URL_API = environment.URL_API;

    constructor(
        private route: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _userPreferencesService: UserPreferencesService,
    ) {
        super();
    }

    initForm() {
        this.form = this._formBuilder.group({
            name: [''],
        });
    }
    ngOnInit() {
        this.employees = this.route.snapshot.data['staff'][0].data;


        this.dataSource = new MatTableDataSource<any>(
            this.employees.items,
        );

        this.dataSource.sort = this.sort;
        this.totalItems = this.employees.pagination.totalItems;

        this.initForm();

        this.handleFilterChange();
    }

    handleFilterChange() {

        this.searchForm.valueChanges.subscribe((value) => {
            this.filterQuery = `q=${value}`;
            this.syncData();
        });
    }

    syncData(query = this.filterQuery, data = {}) {
        this._userPreferencesService
            .getRatings(this.page, this.itemsPerPage, query, data)
            .subscribe((data:any) => {
                
                this.employees = data.data;
                this.dataSource = new MatTableDataSource<any>(
                    this.employees.items,
                );
                this.totalItems = this.employees.pagination.totalItems;
                this.dataSource.sort = this.sort;
            });
    }

    onRateChange(event: any,employee:any,service:any) {
        console.log(event,employee,service);
        
        
        this._userPreferencesService
            .setRating(
                {
                    newRating: event,
                    staffId: employee._id,
                    serviceId: service._id,
                },
            )
            .subscribe(() => {
                this.syncData();
            });
    }

    pageChanged(event: PageEvent) {
        this.page = event.pageIndex + 1;
        this.itemsPerPage = event.pageSize;

        this.syncData();
    }

}
