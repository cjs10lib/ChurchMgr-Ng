import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeIn, fadeInDown, fadeInRight } from 'ng-animate';
import { combineLatest, Subscription } from 'rxjs';

import { GivingCategory } from '../../../../../models/giving-category.model';
import { Giving } from '../../../../../models/person-giving.model';
import { ConvertTimestampService } from './../../../../../services/convert-timestamp.service';
import { PersonGivingCategoryService } from './../../../../../services/person-giving-category.service';
import { PersonGivingService } from './../../../../../services/person-giving.service';

@Component({
  selector: 'app-giving-anonymous',
  templateUrl: './giving-anonymous.component.html',
  styleUrls: ['./giving-anonymous.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn,{params: { timing: 0.20, delay: 0 }}))]),
    trigger('fadeInDown', [transition('* => *', useAnimation(fadeInDown, {params: { timing: 0.20, delay: 0 }}))]),
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight, {params: { timing: 0.20, delay: 0 }}))]),
  ],
})
export class GivingAnonymousComponent implements OnInit, OnDestroy {

  fadeIn: any;
  fadeInDown: any;
  fadeInRight: any;

  // search Qry
  searchQry: string;

  anonymousGiving: Giving[] = [];
  filteredGiving: Giving[] = [];

  categories: GivingCategory[] = [];

  showSpinner = true;
  subscription: Subscription;

  constructor(private givingService: PersonGivingService, 
    private givingCategoryService: PersonGivingCategoryService,
    private timestampService: ConvertTimestampService) { }

  ngOnInit() {

    this.subscription = combineLatest(this.givingService.getGivings(), 
      this.givingCategoryService.getGivingCategories()
    ).subscribe(resp => {
      this.showSpinner = false;

      resp[0].forEach(item => {
        if (item.data.person.toLowerCase() === 'anonymous') {

          item.givingDate = this.timestampService.timestampToDate(item.givingDate);
          this.anonymousGiving.push(item);
        }
      });

      this.filteredGiving = this.anonymousGiving;

      // get categories
      this.categories = resp[1];
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getCategoryDetails(categoryId) {
    if (!categoryId) {
      return;
    }

    const index = this.categories.findIndex(p => p.Id === categoryId);
    return this.categories[index].name;
  }

  search(qry: string) {

    this.filteredGiving = qry ?
    this.anonymousGiving.filter(
      p => p.givingDate.toLocaleDateString().includes(qry.toLowerCase())) : this.anonymousGiving;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';   
  }

}
