import { PeopleService } from './../../../services/people.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger
} from '@angular/animations';
import { Person } from '../../../models/person.model';

@Component({
  selector: 'app-people-registry',
  templateUrl: './people-registry.component.html',
  styleUrls: ['./people-registry.component.scss'],
  animations: [
    trigger('people-registryStagger', [
      transition('* <=> *', [
        query(':enter',
        [
          style({opacity: 0, transform: ' translateY(-15px)' }),
          stagger('50ms',
          animate('550ms ease-out',
          style({ opacity: 1, transform: 'translateY(0px)' })))
        ], { optional: true }),
        query(':leave', animate('50ms', style({ opacity: 0 })), {
          optional: true
        })
      ])
    ])
  ]
})
export class PeopleRegistryComponent implements OnInit, OnDestroy {

  searchQry: string;

  people$: Person[];
  filteredPeople: Person[];

  subscription: Subscription;

  constructor(private peopleService: PeopleService) { }

  ngOnInit() {
    this.subscription = this.peopleService.getPeople().subscribe(resp => {
      this.people$ = this.filteredPeople = resp;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(qry: string) {

    this.filteredPeople = qry ?
    this.people$.filter(
      p => p.surname.toLowerCase().includes(qry.toLowerCase()) ||
      p.firstname.toLowerCase().includes(qry.toLowerCase())) : this.people$;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
