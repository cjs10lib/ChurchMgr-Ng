import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInRight, zoomIn } from 'ng-animate';
import { Observable, Subscription } from 'rxjs';

import { FormControl } from '../../../../../../node_modules/@angular/forms';
import { map, startWith } from '../../../../../../node_modules/rxjs/operators';
import { ConvertTimestampService } from '../../../../services/convert-timestamp.service';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { Visitor } from './../../../../models/person-visitor.model';
import { Person } from './../../../../models/person.model';
import { PeopleVisitorService } from './../../../../services/people-visitor.service';
import { PeopleService } from './../../../../services/people.service';

@Component({
  selector: 'app-visitors-form',
  templateUrl: './visitors-form.component.html',
  styleUrls: ['./visitors-form.component.scss'],
  animations: [
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight, {params: { timing: 0.75, delay: 0 }}))]),
    trigger('zoomIn', [transition('* => *', useAnimation(zoomIn, {params: { timing: 0.50, delay: 0 }}))]),
  ],
})
export class VisitorsFormComponent implements OnInit, OnDestroy {

  fadeInRight: any; 
  zoomIn: any; 

  pageTitle = 'Visitors';
  pageIcon = '';

  step = 0;

  myPersonControl = new FormControl;

  visitorId: string;
  visitor: Visitor = {
    contact: {},
    occupation: {},
    invitee: {},
    beliefs: {},
    followUp: {}
  };

  people: Person[];
  filteredOptions: Observable<Person[]>;

  visitorSubscription: Subscription;
  peopleSubscription: Subscription;

  constructor(private visitorService: PeopleVisitorService, private alertService: SweetAlertService,
    private router: Router, private route: ActivatedRoute,
    private timestampService: ConvertTimestampService,
    private peopleService: PeopleService) {


    // get people and initialize autocomplete. Initialised in the constructor to get people before the form loads
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
    this.visitorId = this.route.snapshot.paramMap.get('id');

    if (this.visitorId) {
      // get visitor
      this.visitorSubscription = this.visitorService.getVisitor(this.visitorId).subscribe(resp => {
        this.visitor = resp;
        this.visitor.dob = this.timestampService.timestampToDate(resp.dob);
        this.visitor.beliefs.bornAgainDate = this.timestampService.timestampToDate(resp.beliefs.bornAgainDate);

        this.myPersonControl.setValue(resp.invitee.personId);
      });
    }

  }

  ngOnDestroy(): void {
    if (this.visitorSubscription) {
      this.visitorSubscription.unsubscribe();
    }

    if (this.peopleSubscription) {
      this.peopleSubscription.unsubscribe();
    }
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

    this.visitor.invitee.personId = personId; // assign selected invitee id to model

    if (this.people) {
      const index = this.people.findIndex(p => p.id === personId);
      return index ? this.people[index].fullname : null;
    }
  }

  onSubmit() {
    this.alertService.confirmUpdate().then(async resp => {
      if (resp.value) {

        if (this.visitorId) {
          await this.visitorService.updateVisitor(this.visitorId, this.visitor);
        } else {
          const data = await this.visitorService.addVisitor(this.visitor);

          this.visitorId = data.id;
        }

        this.router.navigate(['visitor-profile', this.visitorId]);
        this.alertService.afterUpdateSuccess();
      }
    });
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
