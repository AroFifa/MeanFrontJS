import { Component, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ShareComponent } from "app/shared/Component/ShareComponent";
import { MatSelectChange } from "@angular/material/select";
import { SalaryService } from "../../salary.service";
import { SelectionModel } from "@angular/cdk/collections";


@Component({
    selector: "app-salary-edit",
    templateUrl: "./salary-edit.component.html"
})
export class SalaryEditComponent extends ShareComponent {
    pageTitle = "Modification du salaire";
    staff: SelectionModel<any>;
    frequencies: any[];
    frequency: any;



    constructor(
        public matDialogRef: MatDialogRef<SalaryEditComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _salaryService: SalaryService,
    ) {
        super();
    }

    initForm(){
        this.form = this._formBuilder.group({
            updateDate: [new Date(),Validators.required],
            amount: ['',[Validators.min(0),Validators.required]],
            frequencyValue: [ 1,Validators.required],
            frequency: [this.frequency._id,Validators.required],
        })
    }

    ngOnInit() {
        this.staff = this.data.staff;


        if(this.staff.selected.length === 1) this.pageTitle+=` de ${this.staff.selected[0].firstName} ${this.staff.selected[0].name}`;
        else this.pageTitle+=` de ${this.staff.selected.length} employés`;

        this.frequencies = this.data.frequencies;

        this.frequency = this.frequencies.find((frq)=>frq.level===10);
        this.initForm();


    }

    closeModal() {
        this.matDialogRef.close();
    }

    onSubmit() {

        
        if (this.form.invalid) return;
        this.form.disable();

        const salary : any = {
            ...this.form.value,
            frequency: {
                id: this.frequency._id,
                frequency: this.frequency.frequency,
                level: this.frequency.level
            },
        };
        

        const employees : any[] = this.staff.selected.map((employee: any) => { return {id: employee._id} });
        
        
        this._salaryService.create({salary,employees}).subscribe((data) => {
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

    onFrequencyChange(event: MatSelectChange){
        this.frequency = this.frequencies.find((frequency) => frequency._id === event.value);
    }

    


}