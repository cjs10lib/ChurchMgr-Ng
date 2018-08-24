import { GivingFormFieldsComponent } from './../giving-form/giving-form-fields/giving-form-fields.component';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';

import { GivingFunctionsService } from './../../../../custom-functions/giving.functions.service';
import { GivingCategory } from './../../../../models/giving-category.model';
import { Giving } from './../../../../models/person-giving.model';
import { PeopleService } from './../../../../services/people.service';
import { PersonGivingCategoryService } from './../../../../services/person-giving-category.service';
import { PersonGivingService } from './../../../../services/person-giving.service';
import { GivingFormComponent } from './../giving-form/giving-form.component';

@Component({
  selector: 'app-giving-report-person',
  templateUrl: './giving-report-person.component.html',
  styleUrls: ['./giving-report-person.component.scss']
})
export class GivingReportPersonComponent implements OnInit, OnDestroy {

  people = [];

  personId: string;

  personGiving = [];
  givingCategories: GivingCategory[] = [];

  giving_category = [];

  givingSummary = [];
  givingTotalAmount;

  displayedColumns: string[] = ['amount', 'date', 'category', 'notes', 'id'];
  dataSource: MatTableDataSource<Giving>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  givingSubscription: Subscription;
  combinedSubscription: Subscription;

  constructor(private givingService: PersonGivingService,
    private categoryService: PersonGivingCategoryService,
    private peopleService: PeopleService,
    private givingFunction: GivingFunctionsService,
    private dialog: MatDialog,
    private route: ActivatedRoute) {

    // placed here to be initialised first
    this.combinedSubscription = combineLatest(this.categoryService.getGivingCategories(), this.peopleService.getPeople())
      .subscribe(([categoryObject, peopleObject]) => {
        this.givingCategories = categoryObject;
        this.people = peopleObject;
      });

  }

  ngOnInit() {
    this.personId = this.route.parent.snapshot.paramMap.get('id');

    this.givingSubscription = this.givingService.getGivingByPerson(this.personId).subscribe(resp => {
      this.personGiving = resp;

      // mapping to a new array to change data structure
      const newPersonGiving = resp.map(p => {
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

    if (this.givingSubscription) {
      this.givingSubscription.unsubscribe();
    }

    if (this.combinedSubscription) {
      this.combinedSubscription.unsubscribe();
    }

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addNewGiving() {

    // terminate all subscriptions
    if (this.givingSubscription) {
      this.givingSubscription.unsubscribe();
    }

    if (this.combinedSubscription) {
      this.combinedSubscription.unsubscribe();
    }

    this.dialog.open(GivingFormComponent, {
      height: '800px',
      width: '1000px',
      data: this.personId
    }).afterClosed().subscribe(() => this.ngOnInit());
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

    const index = this.people.findIndex(per => per.id === personId);
    return this.people[index].fullname;
  }

}
