import { UntypedFormGroup } from '@angular/forms';
import { FuseAlertType } from '../../../@fuse/components/alert';

interface Alert {
    type: FuseAlertType;
    message: string;
}

export class ShareComponent {
    showAlert: boolean = false;
    form: UntypedFormGroup;
    alert: Alert = {
        type: 'success',
        message: '',
    };

    callback: () => void | null = null;

    constructor() {
        this.callback = null;
    }

    buildIdArray(array: any[]) {
        return array.map((x) => x._id);
    }

    handleMessage() {
        this.showAlert = true;
        setInterval(() => {
            this.form.enable();
            this.showAlert = false;
            if (typeof this.callback === 'function') this.callback();
            this.callback = null;
        }, 5000);
    }
}
