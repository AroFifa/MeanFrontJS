import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { WorkHourService } from './workHour.service';
import { MatTableDataSource } from '@angular/material/table';
import { WorkhourCreationComponent } from './workhour-creation/workhour-creation.component';
import { User } from '../../../../models/User';
import { ActivatedRoute } from '@angular/router';
import { WorkhourEditComponent } from './workhour-edit/workhour-edit.component';
import { WorkHour } from '../../../../models/WorkHour';
import { ConfirmationComponent } from '../../../Common/confirmation/confirmation.component';
import { WorkhourStaffComponent } from './workhour-staff/workhour-staff.component';

@Component({
    selector: 'app-workhour',
    templateUrl: './workhour.component.html',
})
export class WorkhourComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    dataSource: any;
    displayedColumns: string[] = [
        'day',
        'start',
        'end',
        'add',
        'edit',
        'delete',
    ];
    staffs: User[];

    constructor(
        private route: ActivatedRoute,
        private _matDialog: MatDialog,
        private _workHourService: WorkHourService,
    ) {}

    ngOnInit() {
        this.dataSource = new MatTableDataSource<User>(
            this.route.snapshot.data['initialData'][0].data,
        );
        this.staffs = this.route.snapshot.data['initialData'][1].data;
    }

    addWorkHour() {
        this._matDialog
            .open(WorkhourCreationComponent, {
                data: { staffs: this.staffs },
            })
            .afterClosed()
            .subscribe(() => this.syncData());
    }

    syncData() {
        this._workHourService.getAll().subscribe((data) => {
            this.dataSource = new MatTableDataSource(data.data);
            this.dataSource.sort = this.sort;
        });
    }

    addStaff(workHour: WorkHour) {
        this._matDialog
            .open(WorkhourStaffComponent, {
                width: '900px',
                data: {
                    staffs: this.staffs,
                    id: workHour._id,
                    selectedStaffs: workHour.employees,
                },
            })
            .afterClosed()
            .subscribe(() => this.syncData());
    }

    updateWorkHour(workHour: WorkHour) {
        this._matDialog
            .open(WorkhourEditComponent, {
                data: { workHour: workHour },
            })
            .afterClosed()
            .subscribe(() => this.syncData());
    }

    deleteWorkHour(id: string) {
        this._matDialog
            .open(ConfirmationComponent, {
                data: {
                    type: 'delete',
                    message: 'Voulez vous supprimez cet heure de travail ? ',
                },
            })
            .afterClosed()
            .subscribe((response) => {
                if (response) {
                    this._workHourService
                        .delete(id)
                        .subscribe(() => this.syncData());
                }
            });
    }
}
