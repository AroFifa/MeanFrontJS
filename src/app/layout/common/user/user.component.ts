import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'app/shared/service/user.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonService } from '../../../shared/service/common.service';
import { User } from '../../../models/User';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
})
export class UserComponent implements OnInit, OnDestroy {
    @ViewChild(MatMenuTrigger) userActionsMenu: MatMenuTrigger;
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */
    user: User;
    URL_API = environment.URL_API;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private _commonService: CommonService,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.user = {
            email: this._commonService.getValue_FromToken('email'),
            userType: this._commonService.getValue_FromToken('userType'),
            pathImg: this._commonService.getValue_FromToken('pathImg'),
            _id: this._commonService.getValue_FromToken('id'),
        };
    }

    openMenu() {
        if (this.userActionsMenu) {
            this.userActionsMenu.openMenu();
        }
    }

    /**
     * On destroy
        private _chatService: ChatService,    */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void {
        // Return if user is not available
        if (!this.user) {
            return;
        }

        // Update the user
        /*   this._userService
            .update({
                ...this.user,
                status,
            })
            .subscribe();*/
    }

    /**
     * Sign out
     */
    signOut(): void {
        this._commonService.signOut();
    }

    account() {
        this._router.navigate(['/staff/account']);
    }
}
