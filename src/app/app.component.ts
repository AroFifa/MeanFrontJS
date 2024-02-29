import { Component } from '@angular/core';
import { LocalService } from './shared/service/local.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    /**
     * Constructor
     */
    constructor(private localService: LocalService) {}
}
