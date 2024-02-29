import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { ShareComponent } from 'app/shared/Component/ShareComponent';
import { FormBuilder, Validators } from '@angular/forms';
import { DashBoardService } from './dashboard.service';

@Component({
    selector       : 'app-dashboard',
    templateUrl    : './dashboard.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent extends ShareComponent implements OnInit, OnDestroy
{
    chartWorkHour: ApexOptions = {};
    chartDailyMonthlyBooking: ApexOptions = {};
    chartDailyMonthlyCA: ApexOptions = {};

    workHourData: any;
    dailyMonthlyBookingData: any;
    caData: any;
    workHourDate : any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    filterBody = {};

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _dashboardService: DashBoardService,
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
    )
    {
        super();
    }

    initForm(){
    
    
        this.form = this._formBuilder.group({
          min_date: [this.workHourDate.min,Validators.required],
          max_date: [this.workHourDate.max,Validators.required],
        });
      }


  handleFilterWorkHourChange() {
    
    this.form.valueChanges.subscribe((value) => {

      if(this.form.invalid) return;

      this.filterBody = {
        date_interval: {
          min: value.min_date,
          max: value.max_date,}      
        };
      this.syncData(this.filterBody);
    });
  
  }
    initWorkHourData() {
        const labels = [];
        const series = [];
        const totalHour = [];
        const averageHour = [];

        this.workHourData.forEach((item:any) => {
            // Extracting labels (staff names)
            labels.push(item.staff.name+ " "+item.staff.firstName);
        
            // Extracting series (averageWorkMinutes)
            totalHour.push(item.totalWorkMinutes);
            averageHour.push(item.averageWorkMinutes);

        });

        series.push({
            name: 'Durée moyenne',
            data: averageHour
        });
        series.push({
            name: 'Durée totale',
            data: totalHour
        });
        this.workHourData = {
            labels,series
        }
    }

    initDailyMonthlyBookingData() {
        const labels = {daily : [],monthly : []};
        const series = {daily : [],monthly : []};
        
        const totalCountDaily = [];
        // const priceCountDaily = [];

        const totalCountMonthly = [];
        // const priceCountMonthly = [];

        

        this.dailyMonthlyBookingData.dailyBookings.forEach((item:any) => {
            // Extracting labels (staff names)
            labels.daily.push(item.label);
        
            totalCountDaily.push(item.totalBookingCount);
            // priceCountDaily.push(item.totalBookingPrice);

        });

        series.daily.push({
            name: 'Nombre de réservations',
            data: totalCountDaily
        });
        // series.daily.push({
        //     name: 'Prix total',
        //     data: priceCountDaily
        // });

        this.dailyMonthlyBookingData.monthlyBookings.forEach((item:any) => {
            // Extracting labels (staff names)
            labels.monthly.push(item.label);
        
            totalCountMonthly.push(item.totalBookingCount);
            // priceCountMonthly.push(item.totalBookingPrice);

        });

        series.monthly.push({
            name: 'Nombre de réservations',
            data: totalCountMonthly
        });
        // series.monthly.push({
        //     name: 'Prix total',
        //     data: priceCountMonthly
        // });
        this.dailyMonthlyBookingData = {
            labels,series
        }
        
    }

    initCaData() {
        const labels = {daily : [],monthly : []};
        const series = {daily : [],monthly : []};
        
        const priceDaily = [];
        const priceMonthly = [];


        

        this.caData.dailyBookings.forEach((item:any) => {
            // Extracting labels (staff names)
            labels.daily.push(item.label);
        
            priceDaily.push(item.ca);

        });

        series.daily.push({
            name: 'CA',
            data: priceDaily
        });

        this.caData.monthlyBookings.forEach((item:any) => {
            labels.monthly.push(item.label);
        
            priceMonthly.push(item.ca);

        });

        series.monthly.push({
            name: 'CA',
            data: priceMonthly
        });
        this.caData = {
            labels,series
        }
        
    }
    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the data
        const staffList =  this.route.snapshot.data['data'][0];
        this.workHourData = staffList.items;
        this.workHourDate = staffList.date_interval;


        const bookingData = this.route.snapshot.data['data'][1];
        this.dailyMonthlyBookingData = bookingData;
        this.caData = bookingData;



        this.initWorkHourData();
        this.initDailyMonthlyBookingData();
        this.initCaData();

        this._prepareChartData();

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    }
                }
            }
        };

        this.initForm();

        this.handleFilterWorkHourChange();
    }



    syncData(data = this.filterBody) {
        this._dashboardService
            .getAverageWorkHour( data)
            .subscribe((response) => {
                this.workHourData = response.items;
                this.workHourDate = response.date_interval;
                this.initWorkHourData();
                this._prepareChartData();
            });

    }


    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void
    {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
             .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
             .forEach((el) => {
                 const attrVal = el.getAttribute('fill');
                 el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
             });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void
    {
        // WOrkhour chart
        this.chartWorkHour = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                toolbar   : {
                    show: false
                },
                zoom      : {
                    enabled: false
                }
            },
            colors     : ['#64748B', '#94A3B8'],
            dataLabels : {
                enabled        : true,
                enabledOnSeries: [0],
                background     : {
                    borderWidth: 0
                },
                formatter: this.displayDuration
            },
            grid       : {
                borderColor: 'var(--fuse-border)'
            },
            labels     : this.workHourData.labels,
            legend     : {
                show: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            series     : this.workHourData.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75
                    }
                }
            },
            stroke     : {
                width: [3, 0]
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark',
                y: {
                    formatter: this.displayDuration
                }
            },
            xaxis      : {
                axisBorder: {
                    show: false
                },
                axisTicks : {
                    color: 'var(--fuse-border)'
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                tooltip   : {
                    enabled: false
                }
            },
            yaxis      : {
                labels: {
                    offsetX: -16,
                    formatter: this.displayDuration,
                    style  : {
                        colors: 'var(--fuse-text-secondary)'
                    }
                }
            }
        };


        // WOrkhour chart
        this.chartDailyMonthlyBooking = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                toolbar   : {
                    show: false
                },
                zoom      : {
                    enabled: false
                }
            },
            colors     : ['#64748B', '#94A3B8'],
            dataLabels : {
                enabled        : true,
                enabledOnSeries: [0],
                background     : {
                    borderWidth: 0
                },
            },
            grid       : {
                borderColor: 'var(--fuse-border)'
            },
            labels     : this.dailyMonthlyBookingData.labels,
            legend     : {
                show: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            series     : this.dailyMonthlyBookingData.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75
                    }
                }
            },
            stroke     : {
                width: [3, 0]
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark',
            },
            xaxis      : {
                axisBorder: {
                    show: false
                },
                axisTicks : {
                    color: 'var(--fuse-border)'
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                tooltip   : {
                    enabled: false
                }
            },
            yaxis      : {
                labels: {
                    offsetX: -16,
                    style  : {
                        colors: 'var(--fuse-text-secondary)'
                    }
                }
            }
        };

        // WOrkhour chart
        this.chartDailyMonthlyCA = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                toolbar   : {
                    show: false
                },
                zoom      : {
                    enabled: false
                }
            },
            colors     : ['#64748B', '#94A3B8'],
            dataLabels : {
                enabled        : true,
                enabledOnSeries: [0],
                background     : {
                    borderWidth: 0
                },
                formatter: this.displayPrice

            },
            grid       : {
                borderColor: 'var(--fuse-border)'
            },
            labels     : this.caData.labels,
            legend     : {
                show: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            series     : this.caData.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75
                    }
                }
            },
            stroke     : {
                width: [3, 0]
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark',
                y: {
                    formatter: this.displayPrice

                }
            },
            xaxis      : {
                axisBorder: {
                    show: false
                },
                axisTicks : {
                    color: 'var(--fuse-border)'
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                tooltip   : {
                    enabled: false
                }
            },
            yaxis      : {
                labels: {
                    offsetX: -16,
                    formatter: this.displayPrice,
                    style  : {
                        colors: 'var(--fuse-text-secondary)'
                    }
                }
            }
        };

    }


    displayDuration(duration: number) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        return `${hours ? hours : '00'}:${minutes ? 
            minutes.toFixed(0) : '00'}`;
    }

    displayPrice(price: number) {
        return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
}
