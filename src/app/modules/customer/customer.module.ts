import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { RdvMngComponent } from './RDV-mng/rdv-mng/rdv-mng.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BryntumCalendarModule } from '@bryntum/calendar-angular';
import { MatChipsModule } from '@angular/material/chips';
import { BookingResolver } from '../../resolvers/BookingResolver';
import { RdvEditComponent } from './RDV-mng/rdv-edit/rdv-edit.component';
import { FuseAlertModule } from '../../../@fuse/components/alert';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const customerRoutes: Route[] = [
    {
        path: 'rdvMng',
        component: RdvMngComponent,
        resolve: {
            data: BookingResolver,
        },
    },
];

@NgModule({
    declarations: [RdvMngComponent, RdvEditComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(customerRoutes),
        MatSidenavModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        NgxMaterialTimepickerModule,
        ReactiveFormsModule,
        MatSortModule,
        MatTableModule,
        BryntumCalendarModule,
        MatChipsModule,
        FuseAlertModule,
        MatProgressSpinnerModule,
    ],
})
export class CustomerModule {}
