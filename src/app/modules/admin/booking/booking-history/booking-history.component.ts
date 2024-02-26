import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-booking-history',
    templateUrl: './booking-history.component.html',
})
export class BookingHistoryComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    items: any[] = [];
    selectedItem: any;
    @ViewChild('itemList') itemList: ElementRef;
    formFieldHelpers: string[] = [''];

    pagination = {
        startIndex: 0,
        endIndex: 9,
        totalResults: 20,
        currentPage: 1,
        lastPage: 3,
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    ) {}
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
                price: 80000
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
                payed_amount: 30000
                // description: 'Gerer votre mot de passe',
            },
        ];
    }

    ngOnInit(): void {
        this.getItemData();
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


}
