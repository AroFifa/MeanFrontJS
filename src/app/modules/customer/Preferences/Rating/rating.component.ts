import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating',
  template: `
    <mat-icon *ngFor="let star of stars" (click)="onRate(star)" (mouseover)="onHover(star)" 
              (mouseout)="onHoverOut()" 
              [ngStyle]="{'color': star <= hoverState ? 'gold' : star <= rate && hoverState === 0 ? 'gold' : ''}" 
              
    [svgIcon]="'heroicons_solid:star'"

    >
    </mat-icon>
  `,
  styles: [`
    mat-icon {
      cursor: pointer;
    }
  `]
})
export class RatingComponent implements OnInit {
  @Input() rate: number;
  @Output() rateChange = new EventEmitter<number>();
  stars: number[] = [1, 2, 3, 4, 5];
  hoverState = 0;


  constructor() { }

  ngOnInit(): void {
  }

  onRate(star: number) {
    this.rate = star;
    this.rateChange.emit(this.rate);
  }

  onHover(star: number) {
    this.hoverState = star;
  }

  onHoverOut() {
    this.hoverState = 0;
  }
}
