import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { StaffService } from '../staff.service';
import { MatSelectChange } from '@angular/material/select';
import { User } from '../../../../../models/User';
import { ShareComponent } from '../../../../../shared/component/ShareComponent';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-staff-edit',
    templateUrl: './staff-edit.component.html',
})
export class StaffEditComponent extends ShareComponent implements OnInit {
    img: any = null;
    avatarPicture: any = null;
    hidePassword: boolean = true;
    services: any[];
    posts: any[] = [];
    URL_API = environment.URL_API;
    passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    staffData: User;

    constructor(
        public matDialogRef: MatDialogRef<StaffEditComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _staffService: StaffService,
    ) {
        super();
    }

    initForm() {
        this.form = this._formBuilder.group({
            name: [this.staffData.name, Validators.required],
            firstName: [this.staffData.firstName, Validators.required],
            email: [
                this.staffData.email,
                [Validators.required, Validators.email],
            ],
            posts: [this.staffData.posts, Validators.required],
            information: [this.staffData.information],
        });
    }

    updatePostsList(event: MatSelectChange) {
        if (this.posts.filter((p) => p._id == event.value).length != 0) return;
        this.posts = [...this.posts, this.findService(event.value)];
    }

    deletePost(id: any) {
        this.posts = this.posts.filter((p) => p._id !== id);
        if (this.posts.length == 0) this.form.get('posts').setValue('');
    }

    findService(id: number) {
        return this.services.find((service) => service._id === id);
    }

    ngOnInit(): void {
        this.services = this.data.services;
        this.staffData = this.data.staff;
        this.posts = this.staffData.posts;
        this.initForm();
    }

    closeModal() {
        this.matDialogRef.close();
    }

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }

    onFileSelected(event: any) {
        this.avatarPicture = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e: any) => {
            this.img = e.target.result;
        };
        reader.readAsDataURL(this.avatarPicture);
    }

    updateStaff() {
        if (this.form.invalid) return;
        this.form.disable();

        let staff: User = {
            ...this.form.value,
            _id: this.staffData._id,
            posts: this.posts,
            userType: 'Staff',
        };
        let fomData = new FormData();
        fomData.set('file', this.avatarPicture);
        fomData.set('staff', JSON.stringify(staff));

        this._staffService
            .update(this.staffData._id, fomData)
            .subscribe((data) => {
                if (data.state == 'error') this.alert.type = 'error';
                else {
                    this.alert.type = 'success';
                    this.callback = () => {
                        this.form.reset();
                        this.closeModal();
                    };
                }
                this.alert.message = data.message;
                this.handleMessage();
            });
    }
}
