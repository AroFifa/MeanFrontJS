import { Component, Inject, OnInit } from '@angular/core';
import { ShareComponent } from '../../../../../shared/Component/ShareComponent';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { WorkHourService } from '../workHour.service';
import { WorkHour } from '../../../../../models/WorkHour';

@Component({
    selector: 'app-workhour-edit',
    templateUrl: './workhour-edit.component.html',
})
export class WorkhourEditComponent extends ShareComponent implements OnInit {
    workHour: WorkHour;

    constructor(
        public matDialogRef: MatDialogRef<WorkhourEditComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _workHourService: WorkHourService,
    ) {
        super();
    }
    ngOnInit(): void {
        this.workHour = this.data.workHour;
        this.initForm();
    }

    initForm() {
        this.form = this._formBuilder.group({
            start: [this.workHour.start, Validators.required],
            end: [this.workHour.end, Validators.required],
            dow: [
                this.workHour.dow,
                [Validators.required, Validators.pattern(/[1-6]/)],
            ],
        });
    }

    closeModal() {
        this.matDialogRef.close();
    }

    updateWorkHour() {
        if (this.form.invalid) return;

        this.form.disable();

        this.workHour = {
            ...this.workHour,
            dow: this.form.value.dow,
            start: this.form.value.start,
            end: this.form.value.end,
        };

        this._workHourService
            .update(this.workHour._id, this.workHour)
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
