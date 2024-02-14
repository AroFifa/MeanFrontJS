import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ServiceComponent } from './service/service.component';
import { CommissionComponent } from './commission/commission.component';



const serviceRoutes: Route[] = [
  {
      path: 'services',
      component: ServiceComponent,
  },
  {
      path: 'commissions',
      component: CommissionComponent
  }
];

@NgModule({
  declarations: [
    ServiceComponent,
    CommissionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(serviceRoutes),
  ]
})
export class ServiceModule { }
