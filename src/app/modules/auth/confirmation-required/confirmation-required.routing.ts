import { Route } from '@angular/router';
import { AuthConfirmationRequiredComponent } from 'app/modules/auth/confirmation-required/confirmation-required.component';
import { ConfirmationResolver } from './ConfirmationResolver';

export const authConfirmationRequiredRoutes: Route[] = [
    {
        path: '',
        component: AuthConfirmationRequiredComponent,
        resolve: {
            data: ConfirmationResolver,
        },
    },
];
