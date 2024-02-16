import { Component, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ShareComponent } from "app/shared/Component/ShareComponent";
import { ExpenseService } from "../../expense.service";
import { MatSelectChange } from "@angular/material/select";


@Component({
    selector: "app-expense-creation",
    templateUrl: "./../expense-save.component.html"
})
export class ExpenseCreationComponent extends ShareComponent {
    pageTitle = "Enregistrer une dépense";
    categories: any[];
    frequencies: any[];
    category: any;
    frequency: any;

    displayFrequencyInput = false;


    constructor(
        public matDialogRef: MatDialogRef<ExpenseCreationComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _expenseService: ExpenseService,
    ) {
        super();
    }

    initForm(){
        this.form = this._formBuilder.group({
            name: ['',Validators.required],
            description: [''],
            date: [new Date(),Validators.required],
            amount: ['',Validators.min(0)],
            expenseCategory: [this.category._id,Validators.required],
            frequencyValue: [1],
            frequency: [this.frequency._id],
        })
    }

    ngOnInit() {
        this.categories = this.data.categories;
        this.frequencies = this.data.frequencies;

        this.category = this.categories.find((ctg)=>ctg.categoryName.toLowerCase()==="dépenses ponctuelles");
        this.frequency = this.frequencies.find((frq)=>frq.level===0);
        this.initForm();


    }

    closeModal() {
        this.matDialogRef.close();
    }

    onSubmit() {

        
        if (this.form.invalid) return;
        this.form.disable();

        let expense : any = {
            ...this.form.value,
            expenseCategory: {
                id: this.category._id,
                categoryName: this.category.categoryName
            },
            frequency: {
                id: this.frequency._id,
                frequency: this.frequency.frequency,
                level: this.frequency.level
            },
        };
        
        
        
        this._expenseService.create(expense).subscribe((data) => {
            if (data.state == 'error') this.alert.type = 'error';
            else {
                this.alert.type = 'success';
                this.callback = () => {
                    this.form.reset();
                    this.closeModal();
                };
            }
            console.error(data.message);
            
            this.alert.message = data.message;
            this.handleMessage();
        });
    }

    onFrequencyChange(event: MatSelectChange){
        this.frequency = this.frequencies.find((frequency) => frequency._id === event.value);
    }

    onCategoryChange(event: MatSelectChange){
        this.category = this.categories.find((category) => category._id === event.value);
        this.toggleFerquencyInput(this.category.categoryName);
    }

    toggleFerquencyInput(categoryName: string) {
        
        if (categoryName.toLowerCase() === 'dépenses ponctuelles'){ this.displayFrequencyInput = false;
            this.form.get('frequency').clearValidators();
        }
        else{ this.displayFrequencyInput = true;
            this.form.get('frequency').setValidators(Validators.required);
        }
    }
}