import { ActivatedRoute } from '@angular/router';
import { PeopleService } from './../../../../../services/people.service';
import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../../../../../models/person.model';

@Component({
  selector: 'app-profile-bio',
  templateUrl: './profile-bio.component.html',
  styleUrls: ['./profile-bio.component.scss']
})
export class ProfileBioComponent implements OnInit {

  personData;

  constructor(private peopleService: PeopleService, private route: ActivatedRoute) { }

  ngOnInit() {
    const personId = this.route.parent.snapshot.paramMap.get('id');

    this.personData = this.peopleService.getPerson(personId);
  }

}
