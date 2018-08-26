import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { fadeIn, fadeInDown, fadeInRight } from 'ng-animate';
import { Giving } from '../../../../../models/person-giving.model';
import { GivingCategory } from '../../../../../models/giving-category.model';
import { Subscription, combineLatest } from 'rxjs';
import { PersonGivingService } from '../../../../../services/person-giving.service';
import { PersonGivingCategoryService } from '../../../../../services/person-giving-category.service';
import { ConvertTimestampService } from '../../../../../services/convert-timestamp.service';

@Component({
  selector: 'app-giving-general',
  templateUrl: './giving-general.component.html',
  styleUrls: ['./giving-general.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn,{params: { timing: 0.20, delay: 0 }}))]),
    trigger('fadeInDown', [transition('* => *', useAnimation(fadeInDown, {params: { timing: 0.20, delay: 0 }}))]),
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight, {params: { timing: 0.20, delay: 0 }}))]),
  ],
})
export class GivingGeneralComponent implements OnInit, OnDestroy {

  fadeIn: any;
  fadeInDown: any;
  fadeInRight: any;

  // search Qry
  searchQry: string;

  generalGiving: Giving[] = [];
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
        if (item.data.person.toLowerCase() === 'general') {

          item.givingDate = this.timestampService.timestampToDate(item.givingDate);
          this.generalGiving.push(item);
        }
      });

      this.filteredGiving = this.generalGiving;

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
    this.generalGiving.filter(
      p => p.givingDate.toLocaleDateString().includes(qry.toLowerCase())) : this.generalGiving;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';   
  }

}
