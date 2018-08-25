import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';

import { GivingFunctionsService } from '../../../../../custom-functions/giving.functions.service';
import { GivingCategory } from '../../../../../models/giving-category.model';
import { MonthlySummary } from '../../../../../models/monthly-summary.model';
import { MonthlySummaryService } from '../../../../../services/monthly-summary.service';
import { PersonGivingCategoryService } from '../../../../../services/person-giving-category.service';
import { PersonGivingService } from '../../../../../services/person-giving.service';

import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn, zoomIn, fadeInLeft } from 'ng-animate';

@Component({
  selector: 'app-giving-overview',
  templateUrl: './giving-overview.component.html',
  styleUrls: ['./giving-overview.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, {params: { timing: 0.25, delay: 0 }}))]),
    trigger('fadeInLeft', [transition('* => *', useAnimation(fadeInLeft, {params: { timing: 0.20, delay: 0 }}))]),
  ],
})
export class GivingOverviewComponent implements OnInit {

  fadeIn: any;
  fadeInLeft: any;

  givingSummary = [];
  givingTotalAmount;

  peopleGivings = [];
  givingCategories: GivingCategory[] = [];

  showSpinner = true;
  subscription: Subscription;
  categorySubscription: Subscription;

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    showScale: false,
    scales: {
      xAxes: [{   
        gridLines: { 
          display : false 
        },
        ticks: {
          beginAtZero:true
        }
      }],
      yAxes: [{
        gridLines: { 
          display : false 
        }
      }]
    }
  };
  barChartLabels: string[] = [];
  // barChartType: string = 'horizontalBar';
  barChartType: string = 'line';
  barChartLegend: boolean = true;
  barChartData = [
    {
      label: '# Total Giving',
      data: []
    }
  ];

  loaded = false;

  constructor(private givingFunction: GivingFunctionsService,
    private givingService: PersonGivingService,
    private categoryService: PersonGivingCategoryService,
    private givingSummaryService: MonthlySummaryService) {
    this.categorySubscription = this.categoryService.getGivingCategories().subscribe(resp => {
      this.givingCategories = resp;
    });
  }

  ngOnInit() {
    this.subscription = combineLatest(this.givingService.getGivings(),
      this.givingSummaryService.getGivingSummary()
    ).subscribe(resp => {

      this.showSpinner = false;

      const givings = resp[0];
      const givingSummary = resp[1];

      this.peopleGivings = givings;
      this.givingSummary = this.givingFunction.getArrayDistinctSumary(givings);
      this.givingTotalAmount = this.givingFunction.getTotalAmount(givings);

      this.populateChart(givingSummary);

    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }

  sortChartLabels(chartLabels: MonthlySummary[]) {
    let order = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return chartLabels.sort((a, b) => {
      return order.indexOf( a.month ) - order.indexOf( b.month );
    });

  }

  populateChart(chartObj: MonthlySummary[]) { 
    
    const _sortItems = this.sortChartLabels(chartObj);
    const _data = _sortItems.map(item => item.total);

    this.barChartLabels = _sortItems.map(item => item.month);
    this.barChartData.map(item => {
      item.data = _data;
    }); 
    
    this.loaded = true;
  }

  getCategoryDetails(categoryId: string) {
    if (!categoryId) {
      return;
    }

    const index = this.givingCategories.findIndex(c => c.Id == categoryId);
    return this.givingCategories[index].name;
  }

}
