import { Component, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ShareComponent } from "app/shared/Component/ShareComponent";
import { ServiceService } from "../../service.service";

@Component({
    selector: "app-service-edit",
    templateUrl: "./../service-save.component.html"
})
export class ServiceEditComponent extends ShareComponent {
    serviceData: any;
    pageTitle = "Modifier un service";
    constructor(
        public matDialogRef: MatDialogRef<ServiceEditComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _serviceService: ServiceService,
    ) {
        super();
    }

    initForm(){
        this.form = this._formBuilder.group({
            name: [this.serviceData.name,Validators.required],
            description: [
                this.serviceData.description],
            price: [
                this.serviceData.price,
                [Validators.required,Validators.min(0)]
            ],
            duration: [
                this.serviceData.duration,
                [Validators.required]
            ]
        })
    }

    ngOnInit(): void {
        this.serviceData = this.data.service;
        this.initForm();
    }


    closeModal() {
        this.matDialogRef.close();
    }



    onSubmit() {
        if (this.form.invalid) return;
        this.form.disable();


        this._serviceService
            .update(this.serviceData._id,this.form.value)
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
        })
        
        ;


    }


}