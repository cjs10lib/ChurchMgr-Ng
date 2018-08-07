import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { FormArray, FormBuilder, FormGroup, Validators } from '../../../../../../../node_modules/@angular/forms';
import { map, startWith } from '../../../../../../../node_modules/rxjs/operators';
import { PersonGivingService } from '../../../../../services/person-giving.service';
import { Person } from './../../../../../models/person.model';
import { PeopleService } from './../../../../../services/people.service';
import { PersonGivingCategoryService } from './../../../../../services/person-giving-category.service';
import { SweetAlertService } from './../../../../../services/sweet-alert.service';

@Component({
  selector: 'app-giving-form-fields',
  templateUrl: './giving-form-fields.component.html',
  styleUrls: ['./giving-form-fields.component.scss']
})
export class GivingFormFieldsComponent implements OnInit, OnDestroy {

  @Input() givingBatch;

  categories$ = [];

  isReady;
  givingForm: FormGroup;
  options: Person[];
  filteredOptions: Observable<Person[]>[] = [];

  subscription: Subscription;
  peopleSubscription: Subscription;

  constructor(private fb: FormBuilder, private givingCategoryService: PersonGivingCategoryService,
    private alertService: SweetAlertService, private givingService: PersonGivingService,
    private peopleService: PeopleService) {

      this.createForm(); // create form
  }

  ngOnInit() {

    // set default date to today
    const control = <FormGroup>this.givingForm.controls.created;
    control.setValue(new Date());

    // get people and filter for auto-complete
    this.peopleSubscription = this.peopleService.getPeople().subscribe(resp => {
      this.options = resp;
    });

    // get categories
    this.subscription = this.givingCategoryService.getGivingCategories().subscribe(resp => {
      this.categories$ = resp;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.peopleSubscription) {
      this.peopleSubscription.unsubscribe();
    }
  }

  createForm() {
    this.givingForm = this.fb.group({
      created: [],
      batch: [],
      records: this.fb.array([])
    });

    this.isReady = true;
  }

  ManageNameControl(index: number) {
    const arrayControl = this.givingForm.get('records') as FormArray;
    this.filteredOptions[index] = arrayControl.at(index).get('personId').valueChanges
      .pipe(
      startWith<string | Person>(''),
      map(value => typeof value === 'string' ? value : value.fullname),
      map(name => name ? this._filter(name) : this.options.slice())
    );

  }

  addNewRecord() {
    const controls = <FormArray>this.givingForm.controls['records'];
    const formGroup = this.fb.group({
      personId: ['', [Validators.required]],
      category: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      notes: []
    });
    controls.push(formGroup);

    // Build the account Auto Complete values
    this.ManageNameControl(controls.length - 1);
  }

  removeRecord(i: number) {
    const controls = <FormArray>this.givingForm.controls['records'];
    controls.removeAt(i);
    // remove from filteredOptions too.
    this.filteredOptions.splice(i, 1);
  }

  displayFn(id) {
    // I want to get the full object and display the name
    if (!id) {
      return '';
    }

    const index = this.options.findIndex(p => p.id === id);
    return this.options[index].fullname;
  }

  private _filter(name: string): Person[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.fullname.toLowerCase().indexOf(filterValue) === 0);
  }

  // save form
  onSubmit() {
    if (!this.givingForm.valid) {
      return this.alertService.fieldRequiredError();
    }

    this.alertService.confirmUpdate().then(resp => {
      if (resp.value) {

        if (this.givingBatch) {
          const control = <FormGroup>this.givingForm.controls.batch;
          control.setValue(this.givingBatch); // sets selected batchId if any
        }

        const controls = <FormArray>this.givingForm.controls['records'];
        // this.givingForm.

        this.givingService.addGiving(this.givingForm.value);

        this.clearControl();
        this.alertService.afterUpdateSuccess();
      }
    });
  }

  // reset form
  clearControl() {
    this.createForm();

    // set date to today
    const control = <FormGroup>this.givingForm.controls.created;
    control.setValue(new Date());
  }
}
