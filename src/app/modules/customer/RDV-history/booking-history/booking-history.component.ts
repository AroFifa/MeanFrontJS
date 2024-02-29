import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { environment } from 'app/environments/environment';
import { ShareComponent } from 'app/shared/Component/ShareComponent';
import { Subject, takeUntil } from 'rxjs';
import { PaymentComponent } from '../payment/payment.component';
import { BookingService } from '../booking.service';
import { ConfirmationComponent } from 'app/modules/Common/confirmation/confirmation.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'app-booking-history',
    templateUrl: './booking-history.component.html',
})
export class BookingHistoryComponent extends ShareComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    items: any[] = [];
    selectedItem: any;
    @ViewChild('itemList') itemList: ElementRef;
    formFieldHelpers: string[] = [''];

    filterBody = {};
    filterOptions : any;


    services: any[];
    serviceFilterData: any[] = [];
    staff: any[];
    staffFilterData: any[] = [];

    URL_API = environment.URL_API;

    pagination = {
        startIndex: 0,
        endIndex: 0,
        totalResults: 0,
        currentPage: 1,
        lastPage: 0,
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _matDialog: MatDialog,
        private _bookingService: BookingService,
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute
    ) {
        super();
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    detectChanges() {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = false;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        
        this.handleFilterChange();
    }


    handleFilterChange() {
        this.form.valueChanges.subscribe((value) => {
            this.filterBody = {
                price_interval: {
                    min: value.min_price,
                    max: value.max_price,
                },

                date_interval: {
                    min: value.min_date,
                    max: value.max_date,
                },
                services: value.services_choice.map((s: any) => s._id),
                employees: value.staff_choice.map((emp: any) => emp._id),
            };
            this.syncData();
        });
    }

    convertDate(date : any){
        return new Date(date);
    }
    removeSeleteditem(){
        
        this.selectedItem = null;
    }

    ngOnInit(): void {
        const data = this.route.snapshot.data['history'][0].data;
        this.items = data.items;

        this.services = this.route.snapshot.data.history[1].data.services;
        this.staff = this.route.snapshot.data.history[2].data;

        
        this.pagination = data.pagination;
        this.filterOptions = data.options;
        this.initForm();

        this.detectChanges();
    }

    onSelectedItem(item: any): void {
        this.selectedItem = item;

        
        

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

   
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    getTime(startDate: Date, durationInMinutes: number): string {
        const endTime = new Date(startDate);
        endTime.setMinutes(endTime.getMinutes() + durationInMinutes);
        // Format the time as "HH:mm"
        return `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
    }



    syncData( data = this.filterBody) {
        this._bookingService
            .getHistory(this.pagination.currentPage, 10, data)
            .subscribe((response) => {
                this.items = response.data.items;
                this.filterOptions = response.data.options;
                this.pagination = response.data.pagination;
                this.selectedItem = this.items.find((item) => item.booking._id === this.selectedItem.booking._id);
            });

        
    }

  onPageChange(step: number ) {
    
    this.pagination.currentPage +=step;
    this.syncData();
  }

  savePayment(){

    this._matDialog
        .open(
            PaymentComponent, {
              width: '900px',
              data: {
                booking: this.selectedItem,
              },
          }
        )
        .afterClosed()
        .subscribe(() => {
            this.syncData();
        });
  }


  cancelBooking() {
    this._matDialog
        .open(ConfirmationComponent, {
            data: {
                type: 'delete',
                message: `Voulez vous annuller cette réservation? `,
            },
        })
        .afterClosed()
        .subscribe((response) => {
            if (response) {
                this._bookingService
                    .delete(this.selectedItem.booking._id)
                    .subscribe(() => this.syncData());
            }
        });
}

// set to the update component
// updateBooking() {
//     this._matDialog
//         .open(ConfirmationComponent, {
//             data: {
//                 type: 'modifier',
//                 message: `Voulez vous modifier cette réservation? `,
//             },
//         })
//         .afterClosed()
//         .subscribe((response) => {
//             if (response) {
//                 this.syncData();
//             }
//         });
// }

doneBooking() {
    this._matDialog
        .open(ConfirmationComponent, {
            data: {
                type: 'Info',
                message: `Terminer cette réservation. `,
            },
        })
        .afterClosed()
        .subscribe((response) => {
            if (response) {
                this._bookingService
                    .update(this.selectedItem.booking._id,{isDone: true})
                    .subscribe(() => this.syncData());
            }
        });
}


initForm() {
    this.form = this._formBuilder.group({
        min_date: [''],
        max_date: [new Date()],
        min_price: [this.filterOptions.price.min],
        max_price: [this.filterOptions.price.max],
        services_choice: [this.serviceFilterData],
        staff_choice: [this.staffFilterData],
    });
}

removeFilterList(
    id: string,
    filterData: any[],
    formControlName: 'services' | 'staff',
) {
    const updatedFilterData = filterData.filter((c) => c._id !== id);
    this.form.get(formControlName + '_choice').setValue(updatedFilterData);
    return updatedFilterData;
}

updateFilterList(
    event: MatSelectChange,
    filterData: any[],
    data: any[],
    formControlName: 'services' | 'staff',
) {
    if (filterData.filter((item) => item._id == event.value).length != 0)
        return filterData;
    const updatedFilterData = [
        ...filterData,
        data.find((item) => item._id === event.value),
    ];
    this.form.get(formControlName + '_choice').setValue(updatedFilterData);

    return updatedFilterData;
}

displayPrice(price: number) {
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

}
