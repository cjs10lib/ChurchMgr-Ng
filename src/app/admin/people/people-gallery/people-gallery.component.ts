import { trigger, transition, useAnimation } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { UploadService } from '../../../services/upload.service';
import { fadeInRight, zoomInDown } from 'ng-animate';

@Component({
  selector: 'app-people-gallery',
  templateUrl: './people-gallery.component.html',
  styleUrls: ['./people-gallery.component.scss'],
  animations: [
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight, {params: { timing: 0.5, delay: 0.5 }}))]),
    trigger('zoomInDown', [transition('* => *', useAnimation(zoomInDown, {params: { timing: 0.5, delay: 0 }}))]),
  ]
})
export class PeopleGalleryComponent implements OnInit {

  fadeInRight: any;
  zoomInDown: any;

  personId: string;
  isHovering: boolean;

  gallery = [];

  private basePath = 'Gallery';

  showSpinner = true;
  subscription: Subscription;

  /** Based on the screen size, switch from standard to one column per row */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(private uploadService: UploadService, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.personId = this.route.parent.snapshot.paramMap.get('id');

    if (this.personId) {
      this.subscription = this.uploadService.getPersonGallery(this.personId).subscribe(resp => {
        this.showSpinner = false;

        this.gallery = resp;
      });
    }
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  upload(event: FileList) {
    this.uploadService.pushUpload(event, this.basePath, this.personId);
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
}
