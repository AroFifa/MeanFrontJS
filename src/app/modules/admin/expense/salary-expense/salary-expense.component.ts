import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'app/environments/environment';
import { SalaryService } from '../salary.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ShareComponent } from 'app/shared/Component/ShareComponent';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationComponent } from 'app/modules/Common/confirmation/confirmation.component';

@Component({
  selector: 'app-salary-expense',
  templateUrl: './salary-expense.component.html',
  styleUrls: ['./salary-expense.component.scss']
})
export class SalaryExpenseComponent extends ShareComponent{

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: any;
  staffList: any;
  staffFilterOptions: any;

  searchForm = new FormControl('');
  filterQuery = '';
  filterBody = {};

  posts : any[];
  postFilterData : any[] = [];
  frequencies : any[];
  frequencyFilterData : any[] = [];

  staffSelected: any[] = [];

  totalItems = 0;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  page = 1;

  URL_API = environment.URL_API;
  displayedColumns: string[] = [
    'avatar',
    'name',
    'firstname',
    'email',
    'posts',
    'salary',
  ];

  constructor(
    private _salaryService: SalaryService,
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    super();
  }


  initForm() {
    this.form = this._formBuilder.group({
      min_amount: [this.staffFilterOptions.amount.min],
      max_amount: [this.staffFilterOptions.amount.max],
      min_freq: [this.staffFilterOptions.frequencyValue.min],
      max_freq: [this.staffFilterOptions.frequencyValue.max],
      posts_choice: [this.postFilterData],
      frequencies_choice: [this.frequencyFilterData]
    });
  }

  ngOnInit() {
    this.staffList = this.route.snapshot.data.initialData[0].data;

    this.frequencies = this.route.snapshot.data.initialData[1].data;
    this.posts = this.route.snapshot.data.initialData[2].data;

    this.staffFilterOptions = this.staffList.options;

    this.dataSource = new MatTableDataSource<any>(this.staffList.staff.items);
    this.dataSource.sort = this.sort;
    this.totalItems = this.staffList.staff.totalItems;

    this.initForm();

    this.handleFilterChange();
  }


  handleFilterChange() {
    this.searchForm.valueChanges.subscribe((value) => {
      this.filterQuery = `q=${value}`;
      this.syncData(this.filterQuery, this.filterBody);      
    });
    
    this.form.valueChanges.subscribe((value) => {

      

      this.filterBody = {
        amount_interval: {
          min: value.min_amount,
          max: value.max_amount,
        },
        frequency_interval: {
          min: value.min_freq,
          max: value.max_freq,
        },
        posts: value.posts_choice.map((p:any) => p._id),
        frequencies: value.frequencies_choice.map((f:any) => f._id),
      };
      this.syncData(this.filterQuery, this.filterBody);
    });
  
  }

  syncData(query= null,data = {}) {

    this._salaryService
        .search(this.page, this.itemsPerPage, query, data)
        .subscribe((response) => {
          this.staffList = response.data;
          console.log(response);
          
          this.dataSource = new MatTableDataSource<any>(this.staffList.staff.items);
          this.dataSource.sort = this.sort;
          this.totalItems = this.staffList.staff.pagination.totalItems;
        });
  }

  
  pageChanged(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.syncData();
  }



  updateSalary() {
    this._matDialog
        .open(
            ConfirmationComponent, {
              width: '900px',
              // data: {
              //   posts: this.posts,
              //   frequencies: this.frequencies,
              //   staff: this.staffSelected,
                
              // },
               data: {
                type: 'delete',
                message: `Voulez vous modifier le salaire." ? `,
            
              },
          }
        )
        .afterClosed()
        .subscribe(() => {
            this.syncData();
        });
  }


  displayPrice(price: number) {
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }


  displayFrequency(frequencyValue: number, frequencyLevel: number) {

    if(frequencyLevel===0)
      return "";

    const frequencyMap = {
        5: 'semaines',
        10: 'mois',
        20: 'ans'    
      };

    let frenchEquivalent = frequencyMap[frequencyLevel];

    

    return `Tous les ${frequencyValue===1?"":frequencyValue+" "}${frenchEquivalent}`;
  }

}
