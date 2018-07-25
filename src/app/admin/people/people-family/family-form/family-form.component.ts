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

  personFamily: PersonFamily = {};

  addFamilyDialog: Family = {};

  families$;

  searchQuery;

  tags = [
    'None',
    'Adult',
    'Teen',
    'Child',
  ];

  subscription: Subscription;

  constructor(private dialog: MatDialog, private personFamilyService: PersonFamilyService, private sweetAlertService: SweetAlertService) { }

  ngOnInit() {
    this.families$ = this.personFamilyService.getFamilies();

    this.subscription = this.personFamilyService.getPersonFamily(this.personId)
      .subscribe(resp => {

        if (resp) {
          this.personFamily = resp;
        }
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onAddPersonFamily() {
    this.sweetAlertService.confirmUpdate().then(resp => {
      if (resp.value) {
        this.personFamilyService.updatePersonFamily(this.personId, this.personFamily);
        this.sweetAlertService.afterUpdateSuccess();
      }
    });
  }

  openDialog() {
    this.dialog.open(FamilyFormAddComponent).afterClosed().subscribe(resp => {
        if (resp) {
          this.addFamilyDialog.name = resp;
          return this.addFamily();
        }
      });
  }

  addFamily() {
    this.personFamilyService.addFamily(this.addFamilyDialog);
  }

  clearFamilySearchField() {
    this.searchQuery = '';
  }

}
