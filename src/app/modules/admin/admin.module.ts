import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from 'app/shared/module/shared.module';
import { DashboardResolver } from 'app/resolvers/DashboardResolver';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

const adminRoutes: Route[] = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        resolve: {
          data: DashboardResolver
        }
    },
    {
        path: 'management',
        loadChildren: () =>
            import('app/modules/admin/Management/management.module').then(
                (m) => m.ManagementModule,
            ),
    },

    {
        path: 'expense',
        loadChildren: () =>
            import('app/modules/admin/expense/expense.module').then(
                (m) => m.ExpenseModule,
            ),
    },
];

@NgModule({
    declarations: [HomeComponent,DashboardComponent],
    imports: [CommonModule, RouterModule.forChild(adminRoutes),
        MatTabsModule,
        NgApexchartsModule,MatFormFieldModule,
        MatDatepickerModule,SharedModule,MatButtonModule,MatButtonToggleModule],
        providers: [
          {provide: LOCALE_ID, useValue: 'fr'},
        ]
})
export class AdminModule {}
