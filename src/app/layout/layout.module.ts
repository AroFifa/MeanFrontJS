import { NgModule } from '@angular/core';
import { LayoutComponent } from 'app/layout/layout.component';
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { CompactLayoutModule } from 'app/layout/layouts/vertical/compact/compact.module';
import { SharedModule } from 'app/shared/module/shared.module';
import { FooterModule } from './common/footer/footer.module';

const layoutModules = [
    // Empty
    EmptyLayoutModule,
    CompactLayoutModule,
];

@NgModule({
    declarations: [LayoutComponent],
    imports: [SharedModule, ...layoutModules],
    exports: [LayoutComponent, FooterModule, ...layoutModules],
})
export class LayoutModule {}
