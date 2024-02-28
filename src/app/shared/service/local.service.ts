import { Injectable } from '@angular/core';
import moment from 'moment-timezone';

@Injectable({
    providedIn: 'root',
})
export class LocalService {
    constructor() {
        this.setDefaultTimezone();
    }

    setDefaultTimezone() {
        moment.tz.setDefault('Indian/Antananarivo');
    }
}
