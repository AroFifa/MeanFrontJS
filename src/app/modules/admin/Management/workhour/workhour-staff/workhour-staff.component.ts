import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShareComponent } from '../../../../../shared/Component/ShareComponent';
import { User } from '../../../../../models/User';
import { MatTableDataSource } from '@angular/material/table';
import { WorkHourService } from '../workHour.service';

@Component({
    selector: 'app-workhour-staff',
    templateUrl: './workhour-staff.component.html',
})
export class WorkhourStaffComponent extends ShareComponent implements OnInit {
    staffs: User[];
    mainData: User[];
    dataSource: any;
    displayedColumns: string[] = ['name', 'firstName', 'email', 'delete'];

    constructor(
        public matDialogRef: MatDialogRef<WorkhourStaffComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _workHourService: WorkHourService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.staffs = this.data.staffs;
        this.mainData = this.data.selectedStaffs;
        this.updateDataSource();
    }

    updateDataSource() {
        this.dataSource = new MatTableDataSource<User>(this.mainData);
    }

    closeModal() {
        this.matDialogRef.close();
    }

    deleteStaff(id: string) {
        this.mainData = this.mainData.filter((x) => x._id != id);
        this.addStaff(this.buildIdArray(this.mainData));
    }

    handleMessage() {
        this.showAlert = true;
        setInterval(() => {
            this.showAlert = false;
            if (typeof this.callback === 'function') this.callback();
            this.callback = null;
        }, 5000);
    }

    addStaff(data: any[]) {
        this._workHourService
            .update(this.data.id, { employees: data })
            .subscribe((data) => {
                if (data.state == 'error') this.alert.type = 'error';
                else {
                    this.alert.type = 'success';
                    this.callback = () => this.updateDataSource();
                }
                this.alert.message = data.message;
                this.handleMessage();
            });
    }

    selectStaff(event: any) {
        let exist = this.dataSource.data.find((x) => x._id == event.value);
        if (exist || !event.value) return;
        let staff = this.staffs.find((x) => x._id == event.value);

        this.mainData.push(staff);
        let data = this.mainData;
        this.addStaff(this.buildIdArray(data));
    }
}
