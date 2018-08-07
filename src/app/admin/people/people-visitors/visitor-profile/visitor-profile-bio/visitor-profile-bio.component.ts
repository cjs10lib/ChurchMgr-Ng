import { ActivatedRoute } from '@angular/router';
import { PeopleVisitorService } from './../../../../../services/people-visitor.service';
import { Visitor } from './../../../../../models/person-visitor.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visitor-profile-bio',
  templateUrl: './visitor-profile-bio.component.html',
  styleUrls: ['./visitor-profile-bio.component.scss']
})
export class VisitorProfileBioComponent implements OnInit {

  visitor: Visitor = {};

  constructor(private visitorService: PeopleVisitorService, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.visitorService.getVisitor(id).subscribe(resp => {
        this.visitor = resp;
      });
    }
  }

}
