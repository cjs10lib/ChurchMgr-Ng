import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInRight, zoomIn } from 'ng-animate';
import { Observable, Subscription } from 'rxjs';

import { FormControl } from '../../../../../../node_modules/@angular/forms';
import { map, startWith } from '../../../../../../node_modules/rxjs/operators';
import { PersonGroup } from '../../../../models/person-group.model';
import { Person } from '../../../../models/person.model';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { PeopleGroupService } from './../../../../services/people-group.service';
import { PeopleService } from './../../../../services/people.service';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss'],
  animations: [
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight, {params: { timing: 0.75, delay: 0 }}))]),
    trigger('zoomIn', [transition('* => *', useAnimation(zoomIn, {params: { timing: 0.50, delay: 0 }}))]),
  ],
})
export class GroupFormComponent implements OnInit, OnDestroy {

  fadeInRight: any; 
  zoomIn: any; 

  pageTitle = 'Add Group';
  pageIcon = '';

  myPersonControl = new FormControl();

  groupId: string;

  group: PersonGroup = {
    contact: {},
    schedule: {}
  };

  people: Person[];
  filteredOptions: Observable<Person[]>;

  step = 0;

  peopleSubscription: Subscription;
  groupSubscription: Subscription;

  constructor(private groupService: PeopleGroupService,
    private peopleService: PeopleService, private alertService: SweetAlertService,
    private router: Router, private route: ActivatedRoute) {

      // get people and initialize autocomplete moved here for early initialization
      this.peopleSubscription = this.peopleService.getPeople().subscribe(resp => {
        this.people = resp;

        this.filteredOptions = this.myPersonControl.valueChanges
          .pipe(
          startWith<string | Person>(''),
          map(value => typeof value === 'string' ? value : value.fullname),
          map(name => name ? this._filter(name) : this.people.slice())
        );
      });
  }

  ngOnInit() {

    this.groupId = this.route.snapshot.paramMap.get('id');

    if (this.groupId) {
      this.groupService.getGroup(this.groupId).subscribe(resp => {
        this.group = resp;
        this.myPersonControl.setValue(resp.leader);
      });
    }

  }

  ngOnDestroy(): void {
    if (this.peopleSubscription) {
      this.peopleSubscription.unsubscribe();
    }

    if (this.groupSubscription) {
      this.groupSubscription.unsubscribe();
    }
  }

  onSubmit() {
    this.alertService.confirmUpdate().then(async resp => {
      if (resp.value) {

        if (this.groupId) {
          await this.groupService.updateGroup(this.groupId, this.group);
        } else {
          await this.groupService.addGroup(this.group);
        }

        this.alertService.afterUpdateSuccess();
        this.router.navigate(['groups']);
      }
    });
  }

  private _filter(name: string): Person[] {
    const filterValue = name.toLowerCase();

    return this.people.filter(option => option.fullname.toLowerCase().includes(filterValue));
    // return this.people.filter(option => option.fullname.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(personId) {

    // I want to get the full object and display the name
    if (!personId) {
      return '';
    }

    this.group.leader = personId; // assign selected person id to model

    const index = this.people.findIndex(p => p.id === personId);
    return this.people[index].fullname;
  }

  resetInput() {
    this.myPersonControl.value(''); // clears auto complete
    this.group = null; // clears giving input
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}
