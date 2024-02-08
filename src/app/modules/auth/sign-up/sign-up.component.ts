import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    UntypedFormBuilder,
    NgForm,
    Validators,
    AsyncValidatorFn,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ShareComponent } from '../../../shared/ShareComponent';
import { FuseValidators } from '../../../../@fuse/validators';
import { User } from '../../../models/User';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignUpComponent extends ShareComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    emailReqex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9_.+-]+\.[a-zA-Z]*$/;
    passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    showAlert: boolean = false;
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
                name: ['', [Validators.required]],
                firstName: ['', Validators.required],
                email: [
                    '',
                    [
                        Validators.required,
                        Validators.email,
                        Validators.pattern(this.emailReqex),
                    ],
                    [this.emailValidator()],
                ],
                password: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(this.passwordRegex),
                    ],
                ],
                password2: ['', [Validators.required]],
            },
            {
                validators: FuseValidators.mustMatch('password', 'password2'),
            },
        );
    }

    checkEmail(email: string) {
        return new Promise((resolve, reject) => {
            this._authService.checkEmail(email).subscribe((data) => {
                resolve(data);
            });
        });
    }

    emailValidator(): AsyncValidatorFn {
        return async (
            control: AbstractControl,
        ): Promise<ValidationErrors | null> => {
            const value = control.value;
            if (!value || this.lastEmail == value) {
                this.lastEmail = value;
                return null;
            }
            this.lastEmail = value;
            const result: any = await this.checkEmail(value);

            return result.state === 'error' ? { emailInvalid: true } : null;
        };
    }

    signUp() {
        if (this.form.invalid) return;
        this.form.disable();
        this.showAlert = false;

        const { password2, ...formValues } = this.form.value;
        const user: User = {
            ...formValues,
            userType: { userType: 'Customer' },
        };

        this._authService.signUp(user).subscribe((data) => {
            if (data.state == 'error') this.alert.type = 'error';
            else {
                this.alert.type = 'success';
                this.callback = () => {
                    this.signUpNgForm.resetForm();
                    this._router.navigate(['/sign-in']).then();
                };
            }
            this.alert.message = data.message;
            this.handleMessage();
        });
    }
}
