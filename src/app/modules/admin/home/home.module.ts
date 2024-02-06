import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const usersRoutes: Route[] = [
    {
        path: '',
        component: HomeComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(usersRoutes)],
    declarations: [HomeComponent],
    exports: [],
})
export class HomeModule {}
