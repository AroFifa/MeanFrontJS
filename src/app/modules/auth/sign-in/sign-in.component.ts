import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, NgForm, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ShareComponent } from '../../../shared/Component/ShareComponent';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/service/common.service';
import { UserService } from '../../../shared/service/user.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignInComponent extends ShareComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _authService: AuthService,
        private _commonService: CommonService,
    ) {
        super();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.form = this._formBuilder.group({
            email: [
                'beautysalon354@gmail.com',
                [Validators.required, Validators.email],
            ],
            password: ['Admin007#', Validators.required],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        if (this.form.invalid) return;
        this.form.disable();
        this.showAlert = false;

        this._authService.signIn(this.form.value).subscribe((data) => {
            if (data.state == 'error') {
                this.alert = {
                    type: 'error',
                    message: data.message,
                };
                this.handleMessage();
            } else {
                this.form.enable();
                this.signInNgForm.resetForm();
                
                localStorage.setItem('accessToken', data.data);
                this._commonService.handleRedirection();
            }
        });
    }
}
