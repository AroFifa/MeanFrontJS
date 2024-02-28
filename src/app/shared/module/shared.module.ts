import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '../../../@fuse/components/alert';
import { AriaryCurrencyPipe } from 'app/custom/pipe/AriaryCurrencyPipe';
import { DurationPipe } from 'app/custom/pipe/DurationPipe';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FuseAlertModule],
    exports: [CommonModule, FormsModule, ReactiveFormsModule,AriaryCurrencyPipe,DurationPipe],
    declarations: [AriaryCurrencyPipe,DurationPipe],
})
export class SharedModule {}
