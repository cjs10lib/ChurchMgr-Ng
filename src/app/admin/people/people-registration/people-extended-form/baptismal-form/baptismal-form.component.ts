import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Baptism } from '../../../../../models/person-baptism.model';
import { PeopleBaptismService } from '../../../../../services/people-baptism.service';
import { SweetAlertService } from '../../../../../services/sweet-alert.service';
import { ConvertTimestampService } from './../../../../../services/convert-timestamp.service';

@Component({
  selector: 'app-baptismal-form',
  templateUrl: './baptismal-form.component.html',
  styleUrls: ['./baptismal-form.component.scss']
})
export class BaptismalFormComponent implements OnInit, OnDestroy {

  @Input() personId;

  baptismalStatus = [
    { name: 'Baptised', value: 'Baptised' },
    { name: 'Not-Baptised', value: 'Not-Baptised' }
  ];

  baptism: Baptism = {};
  subscription: Subscription;

  constructor(private peopleBaptismService: PeopleBaptismService,
    private alertService: SweetAlertService,
    private timestampService: ConvertTimestampService) { }

  ngOnInit() {

    if (this.personId) {
      this.subscription = this.peopleBaptismService.getPersonBaptism(this.personId)
        .subscribe(resp => {
          if (resp) {
            this.baptism = resp;
            this.baptism.baptismalDate = this.timestampService.timestampToDate(resp.baptismalDate);
          }
        });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async onSubmit() {
    const confirm = await this.alertService.confirmUpdate();
      if (confirm.value) {

        await this.peopleBaptismService.updatePersonBaptism(this.personId, this.baptism);
        this.alertService.afterUpdateSuccess();
      }
  }

  clearBaptismFields() {
    this.baptism = {};
    // this.baptism.baptisedBy = '';
    // this.baptism.baptismalDate = null;
    // this.baptism.churchBaptised = '';
    // this.baptism.extraNotes = '';
  }

}
