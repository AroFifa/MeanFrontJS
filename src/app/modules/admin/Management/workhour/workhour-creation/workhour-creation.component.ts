import { Component, Inject, OnInit } from '@angular/core';
import { ShareComponent } from '../../../../../shared/Component/ShareComponent';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { WorkHourService } from '../workHour.service';

@Component({
    selector: 'app-workhour-creation',
    templateUrl: './workhour-creation.component.html',
})
export class WorkhourCreationComponent
    extends ShareComponent
    implements OnInit
{
    constructor(
        public matDialogRef: MatDialogRef<WorkhourCreationComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _workHourService: WorkHourService,
    ) {
        super();
    }
    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.form = this._formBuilder.group({
            start: ['', Validators.required],
            end: ['', Validators.required],
            dow: ['', [Validators.required, Validators.pattern(/[1-6]/)]],
        });
    }

    closeModal() {
        this.matDialogRef.close();
    }

    addWorkHour() {
        if (this.form.invalid) return;

        this.form.disable();

        this._workHourService.create(this.form.value).subscribe((data) => {
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
