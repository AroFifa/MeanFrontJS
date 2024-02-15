import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { StaffHomeComponent } from './home/staff-home/staff-home.component';

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
];

@NgModule({
    declarations: [StaffHomeComponent],
    imports: [CommonModule, RouterModule.forChild(staffRoutes)],
})
export class StaffModule {}
