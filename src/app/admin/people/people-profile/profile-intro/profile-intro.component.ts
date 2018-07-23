import { SweetAlertService } from './../../../../services/sweet-alert.service';
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

  constructor(private peopleService: PeopleService, private router: Router, private sweetAlertService: SweetAlertService) { }

  ngOnInit() {}

  deleteProfile() {
    this.sweetAlertService.confirmDelete().then(resp => {
      if (resp.value) {
        this.peopleService.deletePerson(this.person.id);

        this.sweetAlertService.afterDeleteSuccess();
        this.router.navigate(['people']);
      }
    });
  }

}
