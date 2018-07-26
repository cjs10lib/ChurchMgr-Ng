import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFireStorage, AngularFireUploadTask } from '../../../../../node_modules/angularfire2/storage';
import { UploadService } from '../../../services/upload.service';
import { Upload } from '../../../models/upload.model';

@Component({
  selector: 'app-people-gallery',
  templateUrl: './people-gallery.component.html',
  styleUrls: ['./people-gallery.component.scss']
})
export class PeopleGalleryComponent implements OnInit {

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadUrl: Observable<string>;

  isHovering: boolean;

  selectedFiles: FileList;
  currentUpload: Upload;

  constructor(private storage: AngularFireStorage, private uploadService: UploadService) { }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  // async startUpload(event: FileList) {
  //   const file = event.item(0);

  //   if (file.type.split('/')[0] !== 'image') {
  //     console.log('Unsupported file type :(' );
  //     return;
  //   }

  //   // the storage path
  //   const path = `images/${new Date().getTime()}_${file.name}`;

  //   const customMetadata = { app: 'Church-Mgr!' };

  //   // the main task
  //   this.task = this.storage.upload(path, file, { customMetadata });

  //   // progress
  //   this.percentage = this.task.percentageChanges();
  //   this.snapshot = this.task.snapshotChanges();

  //   const downloadURL = (await this.task).downloadURL;

  // }

  // determines if the upload task is active

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  upload(event: FileList) {
    const baseRoot = 'Gallery';
    const files = this.selectedFiles;
    // const filesIndex = _.range(files.length);

    // _.each(filesIndex, (idx) => {
    //   // this.currentUpload = new Upload(files[idx]);
    //   this.currentUpload.file = (files[idx]);
    //   this.uploadService.pushUpload(this.currentUpload, baseRoot);
    // });
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  ngOnInit() {
  }

}
