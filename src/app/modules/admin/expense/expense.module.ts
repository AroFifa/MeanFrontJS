import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
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
import { ExpenseResolver } from 'app/resolvers/ExpenseResolver';
import { SalaryResolver } from 'app/resolvers/SalaryResolver';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntlFrench } from 'app/custom/intl/MatpaginatorIntlFrench';
import localeFr from '@angular/common/locales/fr';
import { SharedModule } from 'app/shared/module/shared.module';
import { ExpenseCreationComponent } from './general-expense/expense-creation/expense-creation.component';
import { ExpenseEditComponent } from './general-expense/expense-edit/expense-edit.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';

registerLocaleData(localeFr, 'fr');


const expenseRoutes: Route[] = [
  {
    path: 'general',
    component: GeneralExpenseComponent,
    resolve: {
      initialData: ExpenseResolver
    }
  },
  {
    path: 'salary',
    component: SalaryExpenseComponent,
    resolve: {
      initialData: SalaryResolver
    }
  },
];


@NgModule({
  declarations: [ GeneralExpenseComponent, SalaryExpenseComponent,ExpenseCreationComponent,ExpenseEditComponent],
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
    MatCardModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSliderModule,
    SharedModule
  ],
  
  providers: [
    {provide: LOCALE_ID, useValue: 'fr'},
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlFrench }

  ]
})
export class ExpenseModule { }
