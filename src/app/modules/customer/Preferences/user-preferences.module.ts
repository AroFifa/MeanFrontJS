import { LOCALE_ID, NgModule } from '@angular/core';
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
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';


import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MatPaginatorIntlFrench } from 'app/custom/intl/MatpaginatorIntlFrench';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSliderModule} from '@angular/material/slider';
import { SharedModule } from 'app/shared/module/shared.module';
import { MatCardModule } from '@angular/material/card';
import { ServicePreferencesComponent } from './service/service-preferences.component';
import { EmployeePreferencesComponent } from './employee/employee-preferences.component';
import { EmployeePreferencesResolver, ServicePreferencesResolver } from 'app/resolvers/UserPreferencesResolver';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BarRatingModule } from 'ngx-bar-rating';
registerLocaleData(localeFr, 'fr');


const userPreferencesRoutes: Route[] = [
  {
      path: 'services',
      component: ServicePreferencesComponent,
      resolve: {
        services: ServicePreferencesResolver
      }
  },
  {
      path: 'staff',
      component: EmployeePreferencesComponent,
      resolve: {
        staff: EmployeePreferencesResolver
      }
  }
];

@NgModule({
  declarations: [
    ServicePreferencesComponent,EmployeePreferencesComponent  ],
  imports: [
    CommonModule,
    RouterModule.forChild(userPreferencesRoutes),
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
    MatPaginatorModule,
    MatSliderModule,
    MatCardModule,
    SharedModule,
    MatFormFieldModule,
    BarRatingModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'fr'},
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlFrench }

  ]
})
export class UserPreferencesModule { }
