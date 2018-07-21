import { PeopleService } from './../../../services/people.service';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
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
export class PeopleRegistryComponent implements OnInit {

  people$: Observable<Person[]>;

  constructor(private peopleService: PeopleService) { }

  ngOnInit() {
    this.people$ = this.peopleService.getPeople();
  }

}
