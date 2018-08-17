import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { GivingBatchComponent } from './../giving-batch/giving-batch.component';

@Component({
  selector: 'app-giving-form',
  templateUrl: './giving-form.component.html',
  styleUrls: ['./giving-form.component.scss']
})
export class GivingFormComponent implements OnInit {

  pageTitle = 'Giving';
  pageIcon = '';

  givingBatch = {};
  showGivingBatch = false;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {}

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

}
