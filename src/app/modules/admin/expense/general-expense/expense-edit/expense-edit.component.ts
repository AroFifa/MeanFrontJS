import { Component, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ShareComponent } from "app/shared/Component/ShareComponent";
import { ExpenseService } from "../../expense.service";
import { MatSelectChange } from "@angular/material/select";


@Component({
    selector: "app-expense-edit",
    templateUrl: "./../expense-save.component.html"
})
export class ExpenseEditComponent extends ShareComponent {
    pageTitle = "Modifier une dépense";
    categories: any[];
    frequencies: any[];
    category: any;
    frequency: any;
    expenseData: any;

    displayFrequencyInput : boolean = true;


    constructor(
        public matDialogRef: MatDialogRef<ExpenseEditComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _expenseService: ExpenseService,
    ) {
        super();
    }

    initForm(){

        
        this.form = this._formBuilder.group({
            name: [this.expenseData.name,Validators.required],
            description: [this.expenseData.description],
            date: [this.expenseData.date,Validators.required],
            amount: [this.expenseData.amount,Validators.min(0)],
            expenseCategory: [this.expenseData.expenseCategory.id,Validators.required],
            frequencyValue: [this.expenseData.frequencyValue],
            frequency: [this.expenseData.frequency.id],
        })
    }

    ngOnInit() {
        this.expenseData = this.data.expense;

        if(this.expenseData.expenseCategory.categoryName.toLowerCase() === 'dépenses ponctuelles') this.displayFrequencyInput = false;
        this.categories = this.data.categories;
        this.frequencies = this.data.frequencies;

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
        
        this._expenseService
            .update(this.expenseData._id,expense)
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