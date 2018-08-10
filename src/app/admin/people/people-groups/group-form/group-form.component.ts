import { PeopleService } from './../../../../services/people.service';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { PeopleGroupService } from './../../../../services/people-group.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonGroup } from '../../../../models/person-group.model';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { FormControl } from '../../../../../../node_modules/@angular/forms';
import { Person } from '../../../../models/person.model';
import { startWith, map } from '../../../../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit, OnDestroy {

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
