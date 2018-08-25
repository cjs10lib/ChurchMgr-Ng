import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fadeIn, fadeInRight } from 'ng-animate';

@Component({
  selector: 'app-giving-form-intro',
  templateUrl: './giving-form-intro.component.html',
  styleUrls: ['./giving-form-intro.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, {params: { timing: 0.90, delay: 0 }}))]),
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight, {params: { timing: 0.50, delay: 0 }}))])
  ],
})
export class GivingFormIntroComponent implements OnInit {

  fadeIn: any;
  fadeInRight: any;

  constructor() {}

  ngOnInit() {
  }

}
