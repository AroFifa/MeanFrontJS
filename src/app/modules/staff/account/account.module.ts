import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { ProfileComponent } from './profile/profile.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Route, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseAlertModule } from '../../../../@fuse/components/alert';

const accountRoute: Route[] = [
    {
        path: '',
        component: AccountComponent,
    },
];

@NgModule({
    declarations: [AccountComponent, ProfileComponent],
    imports: [
        CommonModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        RouterModule.forChild(accountRoute),
        ReactiveFormsModule,
        MatInputModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        FuseAlertModule,
    ],
})
export class AccountModule {}
