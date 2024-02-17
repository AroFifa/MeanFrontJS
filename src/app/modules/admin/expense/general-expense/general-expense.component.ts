import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'app/environments/environment';
import { ShareComponent } from 'app/shared/Component/ShareComponent';
import { ExpenseService } from '../expense.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationComponent } from 'app/modules/Common/confirmation/confirmation.component';
import { ExpenseCreationComponent } from './expense-creation/expense-creation.component';
import { ExpenseEditComponent } from './expense-edit/expense-edit.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-general-expense',
  templateUrl: './general-expense.component.html',
  styleUrls: ['./general-expense.component.scss']
})
export class GeneralExpenseComponent extends ShareComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: any;
  expenses: any;
  expensesFilterOptions: any;

  searchForm = new FormControl('');
  filterQuery = '';
  filterBody = {};

  categories : any[];
  categoryFilterData : any[] = [];
  frequencies : any[];
  frequencyFilterData : any[] = [];

  totalItems = 0;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  page = 1;

  URL_API = environment.URL_API;
  displayedColumns: string[] = [
    'name',
    'amount',
    'date',
    'frequencyDisplay',
    'category',
    'edit',
    'delete',
  ];

  constructor(
    private _expenseService: ExpenseService,
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    super();
  }

  initForm(){
    
    
    this.form = this._formBuilder.group({
      min_amount: [this.expensesFilterOptions.amount.min],
      max_amount: [this.expensesFilterOptions.amount.max],
      min_date: [new Date(this.expensesFilterOptions.date.min)],
      max_date: [new Date(this.expensesFilterOptions.date.max)],
      min_freq: [this.expensesFilterOptions.frequencyValue.min],
      max_freq: [this.expensesFilterOptions.frequencyValue.max],
      categories_choice: [this.categoryFilterData],
      frequencies_choice: [this.frequencyFilterData]
    });
  }

  ngOnInit() {
    this.expenses = this.route.snapshot.data.initialData[0].data;

    this.categories = this.route.snapshot.data.initialData[1].data;
    this.frequencies = this.route.snapshot.data.initialData[2].data;

    this.expensesFilterOptions = this.expenses.options;
    
    this.dataSource = new MatTableDataSource<any>(this.expenses.expenses.items);
    this.dataSource.sort = this.sort; 
    this.totalItems = this.expenses.expenses.pagination.totalItems;

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
        date_interval: {
          min: value.min_date,
          max: value.max_date,
        },
        frequency_interval: {
          min: value.min_freq,
          max: value.max_freq,
        },
        categories: value.categories_choice.map((c:any) => c._id),
        frequencies: value.frequencies_choice.map((f:any) => f._id),
      };
      this.syncData(this.filterQuery, this.filterBody);
    });
  
  }


  syncData(query= null,data = {}) {

    this._expenseService
        .search(this.page, this.itemsPerPage, query, data)
        .subscribe((response) => {
          this.expenses = response.data;
          this.dataSource = new MatTableDataSource<any>(this.expenses.expenses.items);
          this.dataSource.sort = this.sort;
          this.totalItems = this.expenses.expenses.pagination.totalItems;
        });
  }

  pageChanged(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.syncData();
  }

  addExpense() {
    this._matDialog
        .open(
            ExpenseCreationComponent, {
              width: '900px',
              data: {
                categories: this.categories,
                frequencies: this.frequencies,
              },
          }
        )
        .afterClosed()
        .subscribe(() => {
            this.syncData();
        });
  }


  updateExpense(expense:any) {
    this._matDialog
        .open(
            ExpenseEditComponent, {
              width: '900px',
              data: {
                categories: this.categories,
                frequencies: this.frequencies,
                expense
              },
          }
        )
        .afterClosed()
        .subscribe(() => {
            this.syncData();
        });
  }

  deleteExpense(expense:any) {
    this._matDialog.open(ConfirmationComponent, {
      data: {
        type: 'delete',
        message: `Voulez vous supprimez ce dépense:  "${expense.name}" ? `,
    
      },
    })
    .afterClosed()
    .subscribe((response) => {
      if (response) {
        this._expenseService.delete(expense._id)
            .subscribe(() => {
              this.syncData();
            });
      }
    })
    ;
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


displayPrice(price: number) {
  return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}



  removeFilterList(id: string, filterData: any[],formControlName: 'categories'|'frequencies') {
    
        const updatedFilterData = filterData.filter((c) => c._id !==id );
        this.form.get(formControlName+"_choice").setValue(updatedFilterData);
        return updatedFilterData;
  }
  

  updateFilterList(event: MatSelectChange, filterData: any[], data: any[],formControlName: 'categories'|'frequencies') {
    if (filterData.filter((item) => item._id == event.value).length != 0) return filterData;
    const updatedFilterData = [...filterData, data.find((item) => item._id === event.value)];
    this.form.get(formControlName+"_choice").setValue(updatedFilterData);

    return updatedFilterData;
  }



}