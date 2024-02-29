import { Component, OnInit } from '@angular/core';
import { ShareComponent } from '../../../../shared/Component/ShareComponent';
import { User } from '../../../../models/User';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../../shared/service/common.service';
import { UserService } from '../../../../shared/service/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { StaffService } from '../../../admin/Management/staff/staff.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
})
export class ProfileComponent extends ShareComponent implements OnInit {
    loading: boolean = false;
    img: any = null;
    avatarPicture: any = null;
    staff: User;
    URL_API = environment.URL_API;

    constructor(
        private _commonService: CommonService,
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private _staffService: StaffService,
    ) {
        super();
    }
    ngOnInit(): void {
        let userID = this._commonService.getValue_FromToken('id');
        this._userService.getOne(userID).subscribe((res) => {
            this.staff = res.data;
            this.initForm();
        });
    }

    initForm() {
        this.form = this._formBuilder.group({
            name: [this.staff.name, Validators.required],
            firstName: [this.staff.firstName, Validators.required],
            email: [this.staff.email, [Validators.required, Validators.email]],
            information: [this.staff.information],
            phoneNumber: [this.staff.information],
        });
    }

    onFileSelected(event: any) {
        this.avatarPicture = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e: any) => {
            this.img = e.target.result;
        };
        reader.readAsDataURL(this.avatarPicture);
    }

    saveProfile() {
        if (this.form.invalid) return;

        let formData = new FormData();
        let user: User = this.form.value;
        user._id = this.staff._id;
        formData.set('file', this.avatarPicture);
        formData.set('staff', JSON.stringify(user));
        this._staffService.update(user._id, formData).subscribe((data) => {
            if (data.state == 'error') this.alert.type = 'error';
            else {
                this.alert.type = 'success';
                this.callback = null;
                localStorage.setItem('accessToken', data.token);
            }
            this.alert.message = data.message;
            this.handleMessage();
        });
    }
}
