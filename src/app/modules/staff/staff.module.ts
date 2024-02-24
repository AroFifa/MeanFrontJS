import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { StaffHomeComponent } from './home/staff-home/staff-home.component';
import { StaffWorkhourComponent } from './staff-workhour/staff-workhour.component';
import { BryntumCalendarModule } from '@bryntum/calendar-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

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
];

@NgModule({
    declarations: [StaffHomeComponent, StaffWorkhourComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(staffRoutes),
        BryntumCalendarModule,
        MatButtonModule,
        MatIconModule,
        MatSortModule,
        MatTableModule,
    ],
})
export class StaffModule {}
