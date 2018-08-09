import { Router } from '@angular/router';
import { PeopleGroupService } from './../../../../services/people-group.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonGroup } from '../../../../models/person-group.model';
import { SweetAlertService } from '../../../../services/sweet-alert.service';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit, OnDestroy {

  group: PersonGroup = {
    contact: {},
    schedule: {}
  };

  step = 0;

  constructor(private groupService: PeopleGroupService, private alertService: SweetAlertService, private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  onSubmit() {
    this.alertService.confirmUpdate().then(async resp => {
      if (resp.value) {
        await this.groupService.addGroup(this.group);

        this.alertService.afterUpdateSuccess();
        this.router.navigate(['groups']);
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
