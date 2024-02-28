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
import { PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { environment } from 'app/environments/environment';
import { ShareComponent } from 'app/shared/Component/ShareComponent';
import { Subject, takeUntil } from 'rxjs';
import { PaymentComponent } from '../payment/payment.component';
import { BookingService } from '../booking.service';
import { ConfirmationComponent } from 'app/modules/Common/confirmation/confirmation.component';

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
    }

    convertDate(date : any){
        return new Date(date);
    }
    removeSeleteditem(){
        
        this.selectedItem = null;
    }
    getItemData() {
        this.items = [
            {
                id: '1',
                name: "Manucure",
                date: new Date(),
                employee: {
                    id: 1,
                    name: 'Rakoto Ramiarimanana',
                    email: 'rakotoramari@gmail.com'
                },
                icon: 'heroicons_outline:user-circle',
                description: 'Manucure simple',
                achievedDate: null,
                duration: 45,
                price: 80000,
                customerId: 1,
            },
            {
                id: '2',
                name: "Pédicure",
                date: new Date(),
                employee: {
                    id: 1,
                    name: 'Rakoto Ramiarimanana',
                    email: 'rakotoramari@gmail.com'
                },
                achievedDate: new Date(),
                duration: 150,
                icon: 'heroicons_outline:lock-closed',
                price: 150000,
                payed_amount: 30000,
                customerId: 1
                // description: 'Gerer votre mot de passe',
            },
        ];
    }

    ngOnInit(): void {
        const data = this.route.snapshot.data['history'][0].data;
        this.items = data.items;

        
        this.pagination = data.pagination;
        this.filterOptions = data.options;
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
            .search(this.pagination.currentPage, 10, data)
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


updateBooking() {
    this._matDialog
        .open(ConfirmationComponent, {
            data: {
                type: 'modifier',
                message: `Voulez vous modifier cette réservation? `,
            },
        })
        .afterClosed()
        .subscribe((response) => {
            if (response) {
                this.syncData();
            }
        });
}

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
}
