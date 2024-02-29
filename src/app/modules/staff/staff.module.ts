import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { StaffHomeComponent } from './home/staff-home/staff-home.component';
import { StaffWorkhourComponent } from './staff-workhour/staff-workhour.component';
import { BryntumCalendarModule } from '@bryntum/calendar-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { DayCommissionComponent } from './commission/day-commission.component';
import { SharedModule } from 'app/shared/module/shared.module';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);


const staffRoutes: Route[] = [
    {
        path: 'home',
        component: StaffHomeComponent,
    },
    {
        path: '',
        component: StaffHomeComponent,
    },
    {
        path: 'account',
        loadChildren: () =>
            import('app/modules/staff/account/account.module').then(
                (m) => m.AccountModule,
            ),
    },
    {
        path: 'workHour',
        component: StaffWorkhourComponent,
    },

    {
        path: 'commission',
        component: DayCommissionComponent,
    },
];

@NgModule({
    declarations: [StaffHomeComponent, StaffWorkhourComponent,DayCommissionComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(staffRoutes),
        BryntumCalendarModule,
        MatButtonModule,
        MatIconModule,
        MatSortModule,
        MatTableModule,
        SharedModule
    ],providers: [
        {provide: LOCALE_ID, useValue: 'fr'},
      ]
})
export class StaffModule {}
