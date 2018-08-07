import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFireStorage } from 'angularfire2/storage';
import { map } from 'rxjs/operators';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-people-gallery',
  templateUrl: './people-gallery.component.html',
  styleUrls: ['./people-gallery.component.scss']
})
export class PeopleGalleryComponent implements OnInit {

  @Input() personId: string;
  isHovering: boolean;

  gallery = [];

  private basePath = 'Gallery';
  cards;

  /** Based on the screen size, switch from standard to one column per row */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  isPhablet$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Small)
  .pipe(
    map(result => result.matches)
  );


  constructor(private storage: AngularFireStorage, private uploadService: UploadService, private breakpointObserver: BreakpointObserver) {}

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  upload(event: FileList) {
    this.uploadService.pushUpload(event, this.basePath, this.personId);
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  ngOnInit() {
    this.uploadService.getPersonGallery(this.personId).subscribe(resp => {
      this.gallery = resp;
    });
  }

}
