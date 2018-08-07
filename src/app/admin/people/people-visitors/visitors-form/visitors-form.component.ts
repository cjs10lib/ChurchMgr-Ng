import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { Visitor } from './../../../../models/person-visitor.model';
import { PeopleVisitorService } from './../../../../services/people-visitor.service';

@Component({
  selector: 'app-visitors-form',
  templateUrl: './visitors-form.component.html',
  styleUrls: ['./visitors-form.component.scss']
})
export class VisitorsFormComponent implements OnInit {

  pageTitle = 'Visitors';
  pageIcon = '';

  step = 0;

  visitorId: string;
  visitor: Visitor = {
    contact: {},
    occupation: {},
    invitee: {},
    beliefs: {},
    followUp: {}
  };

  constructor(private visitorService: PeopleVisitorService, private alertService: SweetAlertService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.visitorId = this.route.snapshot.paramMap.get('id');

    if (this.visitorId) {
      this.visitorService.getVisitor(this.visitorId).subscribe(resp => {
        this.visitor = resp;
      });
    }
  }

  onSubmit() {
    this.alertService.confirmUpdate().then(async resp => {
      if (resp.value) {

        if (this.visitorId) {
          await this.visitorService.updateVisitor(this.visitorId, this.visitor);
        } else {
          const data = await this.visitorService.addVisitor(this.visitor);

          this.visitorId = data.id;
        }

        this.router.navigate(['visitor-profile', this.visitorId]);
        this.alertService.afterUpdateSuccess();
      }
    });
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}
