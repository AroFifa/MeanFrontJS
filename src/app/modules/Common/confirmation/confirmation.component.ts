import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
})
export class ConfirmationComponent implements OnInit {
    message: string;
    deleteData = {
        type: 'Delete',
        title: 'Suppression',
        color: 'red',
    };
    confirmationData = {
        type: 'Info',
        title: 'Confirmation',
        color: 'green',
    };
    usedData: any;

    constructor(
        public matDialogRef: MatDialogRef<ConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

    ngOnInit(): void {
        this.message = this.data.message;
        if (this.data.type == 'delete') this.usedData = this.deleteData;
        else this.usedData = this.confirmationData;
    }

    closeModal(response: boolean) {
        this.matDialogRef.close(response);
    }
}
