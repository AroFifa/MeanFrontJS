import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPresentationComponent } from './auth-presentation.component';

@NgModule({
    declarations: [AuthPresentationComponent],
    imports: [CommonModule],
    exports: [AuthPresentationComponent],
})
export class AuthPresentationModule {}
