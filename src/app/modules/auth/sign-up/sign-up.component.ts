import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, NgForm, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { TranslocoService } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ShareComponent } from '../../../shared/ShareComponent';
import { FuseValidators } from '../../../../@fuse/validators';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignUpComponent extends ShareComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    regexInput = /^[a-zA-Z0-9]*$/;
    emailReqex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9_.+-]+\.[a-zA-Z]*$/;
    passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    showAlert: boolean = false;
    lastUsername: string = '';
    lastEmail: string = '';

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _authService: AuthService,
        private _router: Router,
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
        this.form = this._formBuilder.group(
            {
                username: [
                    '',
                    [Validators.required, Validators.pattern(this.regexInput)],
                ],
                email: [
                    '',
                    [
                        Validators.required,
                        Validators.email,
                        Validators.pattern(this.emailReqex),
                    ],
                ],
                password: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(this.passwordRegex),
                    ],
                ],
                repassword: ['', [Validators.required]],
            },
            {
                validators: FuseValidators.mustMatch('password', 'repassword'),
            },
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
}
