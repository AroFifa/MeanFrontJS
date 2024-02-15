import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '../../../../@fuse/services/media-watcher';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'account';
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
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
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
