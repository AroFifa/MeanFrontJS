import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { GeneralExpenseComponent } from './general-expense/general-expense.component';
import { SalaryExpenseComponent } from './salary-expense/salary-expense.component';


const expenseRoutes: Route[] = [
  {
    path: 'general',
    component: GeneralExpenseComponent,
  },
  {
    path: 'salary',
    component: SalaryExpenseComponent,
  },
];


@NgModule({
  declarations: [ GeneralExpenseComponent, SalaryExpenseComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(expenseRoutes), 
    MatInputModule,
    MatButtonModule,
    FuseAlertModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatOptionModule,
    MatSelectModule,
    MatChipsModule,
  ]
})
export class ExpenseModule { }
