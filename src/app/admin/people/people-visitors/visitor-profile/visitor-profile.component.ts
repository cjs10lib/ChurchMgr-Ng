import { Visitor } from './../../../../models/person-visitor.model';
import { PeopleVisitorService } from './../../../../services/people-visitor.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visitor-profile',
  templateUrl: './visitor-profile.component.html',
  styleUrls: ['./visitor-profile.component.scss']
})
export class VisitorProfileComponent implements OnInit {

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
