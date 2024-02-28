import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';

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
import { BookingHistoryResolver, BookingResolver } from '../../resolvers/BookingResolver';
import { BookingHistoryComponent } from './RDV-history/booking-history/booking-history.component';
import { PaymentComponent } from './RDV-history/payment/payment.component';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntlFrench } from 'app/custom/intl/MatpaginatorIntlFrench';
import localeFr from '@angular/common/locales/fr';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from 'app/shared/module/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';


registerLocaleData(localeFr, 'fr');


const customerRoutes: Route[] = [
    {
        path: 'rdvMng',
        component: RdvMngComponent,
        resolve: {
            data: BookingResolver,
        },
    },
    {
      path: 'rdvHistory',
      component: BookingHistoryComponent,
      resolve: {
        history: BookingHistoryResolver
      }
    },
    {
      path: 'preferences',
      loadChildren: () => import('app/modules/customer/Preferences/user-preferences.module').then(m => m.UserPreferencesModule)
    
    }
];

@NgModule({

    declarations: [RdvMngComponent,  RdvEditComponent,BookingHistoryComponent,PaymentComponent],

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

        MatOptionModule,
        MatCardModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatExpansionModule,
        MatSliderModule,
        MatCheckboxModule,
        SharedModule,
        MatMenuModule,
        MatRadioModule

    ],
    providers: [
      {provide: LOCALE_ID, useValue: 'fr'},
      { provide: MatPaginatorIntl, useClass: MatPaginatorIntlFrench }
  
    ]
})
export class CustomerModule {}
