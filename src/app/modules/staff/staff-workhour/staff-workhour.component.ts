import { Component, OnInit } from '@angular/core';
import { WorkHourService } from '../../admin/Management/workhour/workHour.service';
import { WorkHour } from '../../../models/WorkHour';
import { CommonService } from '../../../shared/service/common.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-staff-workhour',
    templateUrl: './staff-workhour.component.html',
})
export class StaffWorkhourComponent implements OnInit {
    dataSource: any;
    displayedColumns: string[] = ['day', 'start', 'end'];

    constructor(
        private _workHourService: WorkHourService,
        private _commonService: CommonService,
    ) {}

    ngOnInit(): void {
        let id = this._commonService.getValue_FromToken('id');
        this._workHourService
            .getOne(id)
            .subscribe(
                (data) =>
                    (this.dataSource = new MatTableDataSource<WorkHour>(
                        data.data.items,
                    )),
            );
    }
}
