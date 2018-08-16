import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-people-gallery',
  templateUrl: './people-gallery.component.html',
  styleUrls: ['./people-gallery.component.scss']
})
export class PeopleGalleryComponent implements OnInit {

  personId: string;
  isHovering: boolean;

  gallery = [];

  private basePath = 'Gallery';
  cards;

  /** Based on the screen size, switch from standard to one column per row */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(private uploadService: UploadService, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.personId = this.route.parent.snapshot.paramMap.get('id');

    if (this.personId) {
      this.uploadService.getPersonGallery(this.personId).subscribe(resp => {
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
