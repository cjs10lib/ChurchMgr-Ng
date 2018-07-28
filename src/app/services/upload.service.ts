import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { AngularFireStorage, AngularFireUploadTask } from '../../../node_modules/angularfire2/storage';
import { Observable } from '../../../node_modules/rxjs';
import { finalize, map } from '../../../node_modules/rxjs/operators';
import { Upload } from './../models/upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  uploadTask: AngularFireUploadTask;

  fileToUpload: Upload = {};
  storageRef = this.storage;

  percentageArray;

  uploadCollection: AngularFirestoreCollection<Upload>;
  uploads$: Observable<Upload[]>;

  private percentage: Observable<number>;
  private snapshot: Observable<any>;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private route: ActivatedRoute) {}

  getPersonGallery(personId: string) {

    this.uploadCollection = this.db.collection('gallery', ref => ref.where('personId', '==', personId));

    return this.uploads$ = this.uploadCollection.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Upload;
          data.Id = a.payload.doc.id;

          return data;
        });
      }));
  }

  private uploadPath(person: string, basePath: string) {
    return `${basePath}/${person}/${person}_${new Date().getTime()}`;
  }

  private saveFileData(fileToUpload: Upload) {
    return this.db.collection('gallery').add(fileToUpload);
  }

  private deleteFileData(fileId: string) {
    return this.db.doc(`gallery/${fileId}`).delete();
  }

  private deleteFileStorage(path: string) {
    return this.storageRef.ref(path).delete();
  }

  // getUploadFiles() {
  //   return this.uploads$;
  // }

  getUploadFile(path: string) {
    return this.storageRef.ref(path).getDownloadURL();
  }

  async pushUpload(event: FileList, basePath: string, personId: string) {

    Array.from(event).forEach(file => {

      const path = this.uploadPath(personId, basePath);

      const customMetadata = { app: 'Church-Mgr!' };

      if (file.type.split('/')[0] !== 'image') {
        console.log('Unsupported file type :(' );
        return;
      }

      this.uploadTask = this.storageRef.upload(path, file, {
        customMetadata: customMetadata
      });

      this.percentage = this.uploadTask.percentageChanges();
      this.snapshot = this.uploadTask.snapshotChanges();

      this.uploadTask.snapshotChanges().pipe(finalize(() => {

        this.uploadTask.task.snapshot.ref.getDownloadURL().then(url => {
          console.log(url);
          this.fileToUpload.url = url;

          this.saveFileData(this.fileToUpload); // save file data to firestore gallery
        });
      })).subscribe(resp => {
        this.fileToUpload.personId = personId;
        this.fileToUpload.path = resp.ref.fullPath;
        this.fileToUpload.name = resp.ref.name;
        this.fileToUpload.createdDate = new Date();

        this.fileToUpload.progress = (resp.bytesTransferred / resp.totalBytes) * 100;

      });

    });

    this.fileToUpload = {};
  }

  deleteFile(file: Upload) {
    return this.deleteFileData(file.Id).then(() => {
      this.deleteFileStorage(file.path);
    });
  }

}


