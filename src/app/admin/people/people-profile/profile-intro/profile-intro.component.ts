import { PeopleService } from './../../../../services/people.service';
import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../../../../models/person.model';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-profile-intro',
  templateUrl: './profile-intro.component.html',
  styleUrls: ['./profile-intro.component.scss']
})
export class ProfileIntroComponent implements OnInit {

  @Input() person: Person = {};

  constructor(private peopleService: PeopleService, private router: Router) { }

  ngOnInit() {}

  deleteProfile() {
    if (confirm ('Are you sure of deleting this record?')) {
      this.peopleService.deletePerson(this.person.id);
      this.router.navigate(['people']);
    }
  }

}
