import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { StaffComponent } from './staff/staff.component';
import { StaffResolver } from '../../../resolvers/StaffResolver';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FuseAlertModule } from '../../../../@fuse/components/alert';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { StaffCreationComponent } from './staff/staff-creation/staff-creation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { StaffEditComponent } from './staff/staff-edit/staff-edit.component';

const managementRoutes: Route[] = [
    {
        path: 'staff',
        component: StaffComponent,
        resolve: {
            initialData: StaffResolver,
        },
    },
    {
        path: 'service-mgmt',
        loadChildren: () =>
            import('app/modules/admin/Management/service/service.module').then(
                (m) => m.ServiceModule,
            ),
    }
];

@NgModule({
    declarations: [StaffComponent, StaffCreationComponent, StaffEditComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(managementRoutes),
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
    ],
})
export class ManagementModule {}
