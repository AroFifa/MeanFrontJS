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
                    email: ''
                },
                icon: 'heroicons_outline:user-circle',
                description: 'Manucure simple',
                achievedDate: null,
            },
            {
                id: '2',
                name: "Pédicure",
                date: new Date(),
                employee: {
                    id: 1,
                    name: 'Rakoto Ramiarimanana',
                    email: ''
                },
                achievedDate: new Date(),
                icon: 'heroicons_outline:lock-closed',
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

    getItemInfo(item:any): any {
        return this.items.find((i) => i.id === item.id);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
