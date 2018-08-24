import { MonthlySummaryService } from './../../../../../services/monthly-summary.service';
import { Component, Input, OnDestroy, OnInit, Inject, AfterViewInit, DoCheck } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { FormControl } from '../../../../../../../node_modules/@angular/forms';
import { MatDatepickerInputEvent, MAT_DIALOG_DATA } from '../../../../../../../node_modules/@angular/material';
import { map, startWith, take } from '../../../../../../../node_modules/rxjs/operators';
import { ConvertTimestampService } from '../../../../../services/convert-timestamp.service';
import { PersonGivingService } from '../../../../../services/person-giving.service';
import { GivingCategory } from './../../../../../models/giving-category.model';
import { Giving } from './../../../../../models/person-giving.model';
import { Person } from './../../../../../models/person.model';
import { PeopleService } from './../../../../../services/people.service';
import { PersonGivingCategoryService } from './../../../../../services/person-giving-category.service';
import { SweetAlertService } from './../../../../../services/sweet-alert.service';
import { GivingFunctionsService } from '../../../../../custom-functions/giving.functions.service';

@Component({
  selector: 'app-giving-form-fields',
  templateUrl: './giving-form-fields.component.html',
  styleUrls: ['./giving-form-fields.component.scss']
})
export class GivingFormFieldsComponent implements OnInit, OnDestroy {

  @Input() givingBatch = {
    batchId: ''
  };
  @Input() personId;

  myPersonControl = new FormControl();

  categories$: GivingCategory[];

  // new giving record
  giving: Giving = {
    data: {}
  };

  // updating giving-monthly-summary total
  givingAmountB4Update: number = null;

  peopleGivings = []; // giving records

  // summary list
  peopleGivingSummary;
  sumTotalAmount;

  people: Person[];
  filteredOptions: Observable<Person[]>;

  categorySubscription: Subscription;
  peopleSubscription: Subscription;
  givingSubscription: Subscription;

  constructor(private givingCategoryService: PersonGivingCategoryService,
    private alertService: SweetAlertService, private givingService: PersonGivingService,
    private peopleService: PeopleService,
    private timestampService: ConvertTimestampService,
    private givingFunction: GivingFunctionsService,
    private summaryService: MonthlySummaryService) { }

  ngOnInit() {
    // get people and initialize autocomplete
    this.peopleSubscription = this.peopleService.getPeople().subscribe(resp => {
      this.people = resp;

      this.filteredOptions = this.myPersonControl.valueChanges
        .pipe(
        startWith<string | Person>(''),
        map(value => typeof value === 'string' ? value : value.fullname),
        map(name => name ? this._filter(name) : this.people.slice())
      );

      if (this.personId) {
        // set default value for person
        this.myPersonControl.setValue(this.personId);
        this.myPersonControl.disable();
      }
    });

    // get categories
    this.categorySubscription = this.givingCategoryService.getGivingCategories().subscribe(resp => {
      this.categories$ = resp;
    });

  }

  ngOnDestroy(): void {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }

    if (this.peopleSubscription) {
      this.peopleSubscription.unsubscribe();
    }

    if (this.givingSubscription) {
      this.givingSubscription.unsubscribe();
    }
  }

  async onSubmit() {

    if (!this.giving.givingDate) {
      return alert('Select date for giving before proceeding operation');
    }
    
    const confirm = await this.alertService.confirmUpdate();
      if (confirm.value) {

        if (this.giving.Id) {

          const amountToUpdate = this.giving.data.amount - this.givingAmountB4Update;

          // update record
          await this.givingService.updateGiving(this.giving.Id, this.giving);

          // update giving-monthly-summary
          await this.summaryService.addOrUpdateSummary(this.giving.givingDate, amountToUpdate);

          this.alertService.afterUpdateSuccess();
          this.resetInput();
          return;

        }

        // for personal input
        if (this.personId) {

          // double ensuring that all giving is recorded for this person
          this.giving.data.person = this.personId;
          this.giving.batch = null;

          // save record
          await this.givingService.addGiving(this.giving);

          // update giving-monthly-summary
          await this.summaryService.addOrUpdateSummary(this.giving.givingDate, this.giving.data.amount);

          this.alertService.afterUpdateSuccess();
          this.resetInput();
          return;

        }

      // check if giving batch exists
      if (this.giving.batch) {
        this.giving.batch = this.givingBatch.batchId;
      } else {
        this.giving.batch = null;
      }

      // save record
      await this.givingService.addGiving(this.giving);  

      // update giving-monthly-summary
      await this.summaryService.addOrUpdateSummary(this.giving.givingDate, this.giving.data.amount);

      this.alertService.afterUpdateSuccess();
      this.resetInput();
    }
  }

  async deleteGivingRecord(givingId: string) {
    const confirm = await this.alertService.confirmDelete();
    if (confirm.value) {
      
      let giving = await this.givingService.getGivingById(givingId).pipe(take(1)).toPromise();
      await this.summaryService.addOrUpdateSummary(this.giving.givingDate, -giving['data']['amount']);
    
      await this.givingService.deleteGiving(givingId);

      this.alertService.afterDeleteSuccess();
    }
  }

  editGivingRecord(givingId: string) {
   this.givingService.getGivingById(givingId).pipe(take(1)).subscribe((resp: Giving) => {

    this.giving = resp;
    this.giving.Id = givingId;
    this.givingAmountB4Update = resp.data.amount;
    this.myPersonControl.setValue(this.giving.data.person);

    const givingDate = this.timestampService.timestampToDate(this.giving.givingDate);
    this.giving.givingDate = givingDate;
   });
  }

  getCategorySummary() {
    const data = this.peopleGivings;

    this.peopleGivingSummary = this.givingFunction.getArrayDistinctSumary(data);
    this.sumTotalAmount = this.givingFunction.getTotalAmount(data);
  }

  givingDateEvent(event: MatDatepickerInputEvent<Date>) {
    // coverts selected date to timestamp for easy querying to the qryGivingDate field
    const givingDate = this.timestampService.dateToTimestamp(event.value);

    if (this.personId) {

      this.givingSubscription = this.givingService.getGivingByDateAndPerson(givingDate, this.personId).subscribe(resp => {
        this.peopleGivings =  resp;
        this.getCategorySummary(); // get giving summary
      });

    } else {

      this.givingSubscription = this.givingService.getGivingByDate(givingDate).subscribe(resp => {
        this.peopleGivings =  resp;
        this.getCategorySummary(); // get giving summary
      });

    }

  }

  private _filter(name: string): Person[] {
    const filterValue = name.toLowerCase();

    return this.people.filter(option => option.fullname.toLowerCase().includes(filterValue));
    // return this.people.filter(option => option.fullname.toLowerCase().indexOf(filterValue) === 0);
  }

  getPersonDetails(personId: string) {

    if (!personId) {
      return;
    }

    const index = this.people.findIndex(p => p.id === personId);
    return this.people[index].fullname;
  }

  getCategoryDetails(categoryId) {
    if (!categoryId) {
      return;
    }

    const index = this.categories$.findIndex(p => p.Id === categoryId);
    return this.categories$[index].name;
  }

  displayFn(personId) {

    // I want to get the full object and display the name
    if (!personId) {
      return '';
    }

    this.giving.data.person = personId; // assign selected person id to model

    const index = this.people.findIndex(p => p.id === personId);

    return this.people[index].fullname;
    // return index ? this.people[index].fullname : null;
  }

  resetInput() {    
    this.giving.data.amount = null; 
    this.giving.data.category = null; 
    this.giving.data.notes = null; 

    this.giving.Id = null; 
    this.giving.qryGivingDate = null; 
    this.giving.updatedAt = null; 

    this.givingAmountB4Update = null;
  }

}
