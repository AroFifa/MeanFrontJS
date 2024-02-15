import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ServiceComponent } from './service/service.component';
import { CommissionComponent } from './commission/commission.component';
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
import { ServiceResolver } from 'app/resolvers/ServiceResolver';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';


import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MatPaginatorIntlFrench } from 'app/custom/intl/MatpaginatorIntlFrench';
import { DurationPipe } from 'app/custom/pipe/DurationPipe';
import { AriaryCurrencyPipe } from 'app/custom/pipe/AriaryCurrencyPipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ServiceCreationComponent } from './service/service-creation/service-creation.component';
import { ServiceEditComponent } from './service/service-edit/service-edit.component';
registerLocaleData(localeFr, 'fr');


const serviceRoutes: Route[] = [
  {
      path: 'services',
      component: ServiceComponent,
      resolve: {
        initialData: ServiceResolver
      }
  },
  {
      path: 'commissions',
      component: CommissionComponent,
      resolve: {
        initialData: ServiceResolver
      }
  }
];

@NgModule({
  declarations: [
    ServiceComponent,
    ServiceCreationComponent,
    ServiceEditComponent,
    CommissionComponent,
    DurationPipe,
    AriaryCurrencyPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(serviceRoutes),
    MatInputModule,
    MatButtonModule,
    FuseAlertModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatOptionModule,
    MatSelectModule,
    MatChipsModule,
    MatPaginatorModule
    
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'fr'},
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlFrench }

  ]
})
export class ServiceModule { }
