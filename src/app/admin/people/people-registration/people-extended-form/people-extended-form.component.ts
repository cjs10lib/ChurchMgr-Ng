import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-people-extended-form',
  templateUrl: './people-extended-form.component.html',
  styleUrls: ['./people-extended-form.component.scss']
})
export class PeopleExtendedFormComponent implements OnInit {

  personId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.personId = this.route.snapshot.paramMap.get('id');
  }

}
