
import { SweetAlertService } from '../../../../../services/sweet-alert.service';
import { Baptism } from '../../../../../models/person-baptism.model';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PeopleBaptismService } from '../../../../../services/people-baptism.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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
    private route: ActivatedRoute, private sweetAlertService: SweetAlertService) { }

  ngOnInit() {

    if (this.personId) {
      this.subscription = this.peopleBaptismService.getPersonBaptism(this.personId)
        .subscribe(resp => {
          // tslint:disable-next-line:curly
          if (resp)
            return this.baptism = resp;

        });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    this.sweetAlertService.confirmUpdate().then(resp => {
      if (resp.value) {

        this.peopleBaptismService.updatePersonBaptism(this.personId, this.baptism);
        this.sweetAlertService.afterUpdateSuccess();
      }
    });
  }

  clearBaptismFields() {
    this.baptism.baptisedBy = '';
    this.baptism.baptismalDate = null;
    this.baptism.churchBaptised = '';
    this.baptism.extraNotes = '';
  }

}
