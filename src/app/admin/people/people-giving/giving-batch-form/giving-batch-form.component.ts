import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GivingBatch } from '../../../../models/person-giving.model';
import { PersonGivingBatchService } from '../../../../services/person-giving-batch.service';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { MatDialogRef } from '../../../../../../node_modules/@angular/material';

@Component({
  selector: 'app-giving-batch-form',
  templateUrl: './giving-batch-form.component.html',
  styleUrls: ['./giving-batch-form.component.scss']
})
export class GivingBatchFormComponent implements OnInit {

  @Output() ngSubmit: EventEmitter<any> = new EventEmitter();

  givingBatchId: string;
  givingBatch: GivingBatch = {};

  constructor(private givingBatchService: PersonGivingBatchService,
    private sweetAlertService: SweetAlertService) {}

  ngOnInit() {
  }

  onSubmit() {
    this.sweetAlertService.confirmUpdate().then(async resp => {
      if (resp.value) {
        const batch = await this.givingBatchService.addGivingBatch(this.givingBatch);
        this.givingBatchId = batch.id;
        this.ngSubmit.emit(this.givingBatchId);

        this.sweetAlertService.afterUpdateSuccess();

        // this.dialogRef.close(this.givingBatchId);
      }
    });
  }
}
