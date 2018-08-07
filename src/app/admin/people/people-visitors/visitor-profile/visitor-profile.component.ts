import { SweetAlertService } from './../../../../services/sweet-alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PeopleVisitorService } from '../../../../services/people-visitor.service';

@Component({
  selector: 'app-visitor-profile',
  templateUrl: './visitor-profile.component.html',
  styleUrls: ['./visitor-profile.component.scss']
})
export class VisitorProfileComponent implements OnInit {

  pageTitle = 'Visitors';
  pageIcon = '';

  visitorId: string;

  constructor(private route: ActivatedRoute, private visitorService: PeopleVisitorService,
    private alertService: SweetAlertService, private router: Router) { }

  ngOnInit() {
    this.visitorId = this.route.snapshot.paramMap.get('id');
  }

  async deleteProfile() {
    if (this.visitorId) {

      const alert = await this.alertService.confirmDelete();

      if (alert.value) {
        this.visitorService.deleteVisitor(this.visitorId);

        this.alertService.afterDeleteSuccess();
        this.router.navigate(['visitors']);
      }

    }
  }

}
