import { Component, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ShareComponent } from "app/shared/ShareComponent";
import { ServiceService } from "../../service.service";

@Component({
    selector: "app-service-creation",
    templateUrl: "./../service-save.component.html"
})
export class ServiceCreationComponent extends ShareComponent {
    pageTitle = "Ajouter un service";
    constructor(
        public matDialogRef: MatDialogRef<ServiceCreationComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _serviceService: ServiceService,
    ) {
        super();
    }

    initForm(){
        this.form = this._formBuilder.group({
            name: ['',Validators.required],
            description: [''],
            price: [
                '',
                [Validators.required,Validators.min(0)]
            ],
            duration: [
                '',
                [Validators.required,Validators.min(0),Validators.max(60*24)]
            ]
        })
    }

    ngOnInit(): void {
        this.initForm();
    }


    closeModal() {
        this.matDialogRef.close();
    }



    onSubmit() {
        if (this.form.invalid) return;
        this.form.disable();


        let formData = new FormData();
        
        // append all form values to formData
        for (let key in this.form.value) {
            formData.set(key, this.form.value[key]);
        }


        this._serviceService.create(this.form.value).subscribe((data) => {
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