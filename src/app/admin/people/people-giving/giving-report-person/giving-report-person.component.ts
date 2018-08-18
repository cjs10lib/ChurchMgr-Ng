import { GivingFunctionsService } from './../../../../custom-functions/giving.functions.service';
import { GivingCategory } from './../../../../models/giving-category.model';
import { PersonGivingCategoryService } from './../../../../services/person-giving-category.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Giving } from './../../../../models/person-giving.model';
import { PersonGivingService } from './../../../../services/person-giving.service';

@Component({
  selector: 'app-giving-report-person',
  templateUrl: './giving-report-person.component.html',
  styleUrls: ['./giving-report-person.component.scss']
})
export class GivingReportPersonComponent implements OnInit, OnDestroy {

  personGiving = [];
  givingCategories: GivingCategory[] = [];

  givingSummary = [];
  givingTotalAmount;

  displayedColumns: string[] = ['amount', 'date', 'category', 'notes', 'id'];
  dataSource: MatTableDataSource<Giving>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  givingSubscription: Subscription;
  categorySubscription: Subscription;

  constructor(private givingService: PersonGivingService,
    private categoryService: PersonGivingCategoryService,
    private givingFunction: GivingFunctionsService,
    private route: ActivatedRoute) {

      // placed here to be initialised first
      this.categorySubscription = this.categoryService.getGivingCategories().subscribe(resp => {
        this.givingCategories = resp;
        console.log(resp);
      });

  }

  ngOnInit() {
    const personId = this.route.parent.snapshot.paramMap.get('id');

    this.givingSubscription = this.givingService.getGivingByPerson(personId).subscribe(resp => {
      this.personGiving = resp;

      this.dataSource = new MatTableDataSource(this.personGiving);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.givingSummary = this.givingFunction.getArrayDistinctSumary(this.personGiving);
      this.givingTotalAmount = this.givingFunction.getTotalAmount(this.personGiving);
      console.log(this.givingSummary);
    });
  }

  ngOnDestroy(): void {
    if (this.givingSubscription) {
      this.givingSubscription.unsubscribe();
    }

    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
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

}
