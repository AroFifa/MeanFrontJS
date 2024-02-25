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
    panels: any[] = [];
    selectedPanel: string;
    @ViewChild('panelList') panelList: ElementRef;
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

    removeSeletedPanel(){
        
        this.selectedPanel = null;
    }
    getPanelData() {
        this.panels = [
            {
                id: 'account',
                icon: 'heroicons_outline:user-circle',
                title: 'Profil',
                description: 'Gérer vos informations publiques et privées',
            },
            {
                id: 'security',
                icon: 'heroicons_outline:lock-closed',
                title: 'Sécurité',
                description: 'Gerer votre mot de passe',
            },
        ];
    }

    ngOnInit(): void {
        this.getPanelData();
        this.detectChanges();
    }

    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    getPanelInfo(id: string): any {
        return this.panels.find((panel) => panel.id === id);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
