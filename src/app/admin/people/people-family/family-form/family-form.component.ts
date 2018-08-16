import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { PersonFamilyService } from '../../../../services/person-family.service';
import { Family, PersonFamily } from '../../../../models/person-family.model';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { FamilyFormAddComponent } from '../family-form-add/family-form-add.component';

@Component({
  selector: 'app-family-form',
  templateUrl: './family-form.component.html',
  styleUrls: ['./family-form.component.scss']
})
export class FamilyFormComponent implements OnInit, OnDestroy {

  @Input() personId: string;

  personFamily: Family = {};
  addFamilyDialog: Family = {};

  families$;

  searchQuery: string;

  tags = [
    'None',
    'Adult',
    'Teen',
    'Child',
  ];

  subscription: Subscription;

  constructor(private dialog: MatDialog,
    private personFamilyService: PersonFamilyService,
    private alertService: SweetAlertService) { }

  ngOnInit() {
    this.families$ = this.personFamilyService.getFamilies();

    if (this.personId) {
      this.subscription = this.personFamilyService.getPersonFamily(this.personId)
        .subscribe(resp => {
          if (resp) {
            this.personFamily = resp;
          }
        });
    }

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async onAddPersonFamily() {
    const confirm = await this.alertService.confirmUpdate();
    if (confirm.value) {

      await this.personFamilyService.updatePersonFamily(this.personId, this.personFamily);
      this.alertService.afterUpdateSuccess();
    }
  }

  openDialog() {
    this.dialog.open(FamilyFormAddComponent).afterClosed().subscribe(resp => {
        if (resp) {
          this.addFamilyDialog.name = resp;
          return this.addFamily();
        }
      });
  }

  async addFamily() {
    await this.personFamilyService.addFamily(this.addFamilyDialog);
  }

  clearFamilySearchField() {
    this.searchQuery = '';
  }

}
