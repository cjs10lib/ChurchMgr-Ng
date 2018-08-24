import { Component, OnInit, Inject } from '@angular/core';

import { GivingBatchComponent } from './../giving-batch/giving-batch.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-giving-form',
  templateUrl: './giving-form.component.html',
  styleUrls: ['./giving-form.component.scss']
})
export class GivingFormComponent implements OnInit {

  pageTitle = 'Giving';
  pageIcon = '';

  personId: string;

  givingBatch = {};
  showGivingBatch = false;

  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    // dialog data from parent holding person's Id
    if (this.data.length > 0) {
      this.personId = this.data;
    }
  }

  openDialog() {
    this.dialog.open(GivingBatchComponent, {
      height: '800px',
      width: '1000px',
    }).afterClosed().subscribe(resp => {
      if (resp) {

        this.givingBatch = resp;

        this.showGivingBatch = true; // if batch is generated, show it
      }
    });
  }

  clearBatch() {
    this.givingBatch = {};
    this.showGivingBatch = false;
  }

}
