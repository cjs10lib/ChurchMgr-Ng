import { Router, ActivatedRoute } from '@angular/router';
import { PeopleVisitorService } from './../../../../services/people-visitor.service';
import { Visitor } from './../../../../models/person-visitor.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../node_modules/@angular/forms';
import { SweetAlertService } from '../../../../services/sweet-alert.service';

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
        console.log(resp);
      });
    }
  }

  onSubmit() {
    this.alertService.confirmUpdate().then(async resp => {
      if (resp.value) {

        if (this.visitorId) {
          await this.visitorService.updateVisitor(this.visitorId, this.visitor);
        } else {
          await this.visitorService.addVisitor(this.visitor);
        }

        this.router.navigate(['visitors']);
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
