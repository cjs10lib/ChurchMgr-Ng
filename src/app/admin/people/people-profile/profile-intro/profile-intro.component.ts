import { PeopleService } from './../../../../services/people.service';
import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../../../../models/person.model';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-profile-intro',
  templateUrl: './profile-intro.component.html',
  styleUrls: ['./profile-intro.component.scss']
})
export class ProfileIntroComponent implements OnInit {

  @Input() person: Person = {};

  constructor(private route: ActivatedRoute, private peopleService: PeopleService) { }

  ngOnInit() {}

}
