import { ConvertTimestampService } from './../../../../../custom-functions/convert-timestamp.service';
import { GivingCategory } from './../../../../../models/giving-category.model';
import { Giving } from './../../../../../models/person-giving.model';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '../../../../../../../node_modules/@angular/forms';
import { map, startWith } from '../../../../../../../node_modules/rxjs/operators';
import { PersonGivingService } from '../../../../../services/person-giving.service';
import { Person } from './../../../../../models/person.model';
import { PeopleService } from './../../../../../services/people.service';
import { PersonGivingCategoryService } from './../../../../../services/person-giving-category.service';
import { SweetAlertService } from './../../../../../services/sweet-alert.service';
import { MatDatepickerInputEvent } from '../../../../../../../node_modules/@angular/material';
import firebase = require('../../../../../../../node_modules/firebase');

@Component({
  selector: 'app-giving-form-fields',
  templateUrl: './giving-form-fields.component.html',
  styleUrls: ['./giving-form-fields.component.scss']
})
export class GivingFormFieldsComponent implements OnInit, OnDestroy {

  @Input() givingBatch;
  myPersonControl = new FormControl();

  categories$: GivingCategory[];

  // new giving record
  giving: Giving = {
    data: {}
  };

  peopleGivings: Observable<Giving[]>; // giving records

  people: Person[];
  filteredOptions: Observable<Person[]>;

  categorySubscription: Subscription;
  peopleSubscription: Subscription;

  constructor(private fb: FormBuilder, private givingCategoryService: PersonGivingCategoryService,
    private alertService: SweetAlertService, private givingService: PersonGivingService,
    private peopleService: PeopleService, private timestampService: ConvertTimestampService) {
  }

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
  }

  givingDateEvent(event: MatDatepickerInputEvent<Date>) {
    const givingDate = this.timestampService.dateToTimestamp(event.value);

    // coverts selected date to timestamp for easy querying to the qryGivingDate field
    this.peopleGivings = this.givingService.getGivingByDate(givingDate);
  }

  onSubmit() {
    this.alertService.confirmUpdate().then(resp => {
      if (resp.value) {
        this.giving.batch = this.givingBatch ? this.givingBatch : null ; // set giving batch if it is supplied

        this.givingService.addGiving(this.giving);
        this.alertService.afterUpdateSuccess();
      }
    });
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
  }

  resetInput() {
    this.myPersonControl.value(''); // clears auto complete
    this.giving = null; // clears giving input
  }

}
