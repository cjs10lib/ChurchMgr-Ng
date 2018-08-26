import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { fadeInRight, zoomInDown } from 'ng-animate';
import { combineLatest, Subscription } from 'rxjs';

import { GivingFunctionsService } from '../../../../../custom-functions/giving.functions.service';
import { GivingCategory } from '../../../../../models/giving-category.model';
import { Giving } from '../../../../../models/person-giving.model';
import { PeopleService } from '../../../../../services/people.service';
import { PersonGivingCategoryService } from '../../../../../services/person-giving-category.service';
import { PersonGivingService } from '../../../../../services/person-giving.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-giving-batch-giving',
  templateUrl: './giving-batch-giving.component.html',
  styleUrls: ['./giving-batch-giving.component.scss'],
  animations: [
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight))]),
    trigger('zoomInDown', [transition('* => *', useAnimation(zoomInDown, {params: { timing: 0.50, delay: 0 }}))]),
  ],
})
export class GivingBatchGivingComponent implements OnInit {

  fadeInRight: any;
  zoomInDown: any;

  people = [];

  personId: string;

  personGiving = [];
  givingCategories: GivingCategory[] = [];

  giving_category = [];

  givingSummary = [];
  givingTotalAmount;

  displayedColumns: string[] = ['person', 'amount', 'category', 'date', 'notes', 'id'];
  dataSource: MatTableDataSource<Giving>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showSpinner = true;
  subscription: Subscription;

  constructor(private givingService: PersonGivingService,
    private categoryService: PersonGivingCategoryService,
    private peopleService: PeopleService,
    private givingFunction: GivingFunctionsService,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {

    this.subscription = combineLatest(
      this.categoryService.getGivingCategories(), 
      this.peopleService.getPeople())
      .pipe(switchMap(resp => {
        this.givingCategories = resp[0];
        this.people = [1];

        return this.givingService.getGivingByBatch(this.data);
      })).subscribe(result => {
        
        this.showSpinner = false;
        this.personGiving = result;

        // mapping to a new array to change data structure
        const newPersonGiving = result.map(p => {
          return {
            id: p.Id,
            person: this.getPersonDetails(p.data.person),
            category: this.getCategoryDetails(p.data.category),
            amount: p.data.amount,
            notes: p.data.notes,
            givingDate: p.givingDate
          };
        });

        this.dataSource = new MatTableDataSource(newPersonGiving);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.givingSummary = this.givingFunction.getArrayDistinctSumary(this.personGiving);
        this.givingTotalAmount = this.givingFunction.getTotalAmount(this.personGiving);
         
      });

  }

  ngOnDestroy(): void {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewGiving(givingId: string) {
    console.log(givingId);
  }

  getCategoryDetails(categoryId: string) {
    if (!categoryId) {
      return;
    }

    const index = this.givingCategories.findIndex(cat => cat.Id === categoryId);
    return this.givingCategories[index].name;
  }

  getPersonDetails(personId: string) {
    if (!personId) {
      return;
    }

    if (personId.toLowerCase() === 'general' || personId.toLowerCase() === 'anonymous') {
      return personId;
    }

    const index = this.people.findIndex(per => per.id === personId);
    return this.people[index].fullname;
  }


}
