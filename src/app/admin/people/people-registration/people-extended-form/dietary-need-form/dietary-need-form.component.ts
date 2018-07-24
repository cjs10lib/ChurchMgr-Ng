import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { MatChipInputEvent } from '../../../../../../../node_modules/@angular/material';
import { Subscription } from '../../../../../../../node_modules/rxjs';
import { PersonDietaryNeedsService } from '../../../../../services/person-dietary-needs.service';

@Component({
  selector: 'app-dietary-need-form',
  templateUrl: './dietary-need-form.component.html',
  styleUrls: ['./dietary-need-form.component.scss']
})
export class DietaryNeedFormComponent implements OnInit, OnDestroy {

  @Input() personId: string;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  dietaries$: any[];

  subscription: Subscription;

  constructor(private dietaryNeedsService: PersonDietaryNeedsService) { }

  ngOnInit() {
    this.subscription = this.dietaryNeedsService.getDietaries(this.personId)
    .subscribe(resp => {
      this.dietaries$ = resp;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async addDietary(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.dietaries$.splice(0, 0, value.trim());
      input.value = '';

      await this.dietaryNeedsService.saveDietaryNeed(this.personId, value.trim());
    }
  }

  async removeDietary(dietary: any) {
    const index = this.dietaries$.indexOf(dietary);

    if (index >= 0) {
      this.dietaries$.splice(index, 1);

      await this.dietaryNeedsService.deleteDietaryNeed(this.personId, dietary['id']);
    }
  }
}
