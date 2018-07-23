import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../../../../models/person.model';

@Component({
  selector: 'app-profile-bio',
  templateUrl: './profile-bio.component.html',
  styleUrls: ['./profile-bio.component.scss']
})
export class ProfileBioComponent implements OnInit {

  @Input() person: Person = {};

  constructor() { }

  ngOnInit() {
  }

}
