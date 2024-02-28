import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'app/environments/environment';

import { ActivatedRoute } from '@angular/router';
import { ShareComponent } from 'app/shared/Component/ShareComponent';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl } from '@angular/forms';
import { UserPreferencesService } from '../user-preferences.service';

@Component({
    selector: 'app-service-preferences',
    templateUrl: './service-preferences.component.html',
})
export class ServicePreferencesComponent extends ShareComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dataSource: any;
    services: any;

    searchForm = new FormControl('');
    filterQuery = '';

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
        'rating',
    ];

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
        this.services = this.route.snapshot.data['services'][0].data;


        this.dataSource = new MatTableDataSource<any>(
            this.services.services,
        );

        this.dataSource.sort = this.sort;
        this.totalItems = this.services.pagination.totalItems;

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
            .getRatings("services",this.page, this.itemsPerPage, query, data)
            .subscribe((data) => {
                
                this.services = data.data;
                this.dataSource = new MatTableDataSource<any>(
                    this.services.services,
                );
                this.totalItems = this.services.pagination.totalItems;
                this.dataSource.sort = this.sort;
            });
    }

    onRateChange(event: any,service:any) {
        
        this._userPreferencesService
            .setRating(
                {
                    newRating: event,
                    serviceId: service._id,
                },
                'services',
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

    displayPrice(price: number) {
        return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    displayDuration(duration: number) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        return `${hours ? hours : '00'}:${minutes ? minutes : '00'}`;
    }
}
