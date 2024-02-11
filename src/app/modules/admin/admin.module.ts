import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { Route, RouterModule } from '@angular/router';

const adminRoutes: Route[] = [
    {
        path: 'admin/dashboard',
        component: HomeComponent,
    },
    {
        path: 'management',
        loadChildren: () =>
            import('app/modules/admin/Management/management.module').then(
                (m) => m.ManagementModule,
            ),
    },
];

@NgModule({
    declarations: [HomeComponent],
    imports: [CommonModule, RouterModule.forChild(adminRoutes)],
})
export class AdminModule {}
