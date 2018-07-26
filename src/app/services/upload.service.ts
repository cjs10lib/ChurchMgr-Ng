import { Upload } from './../models/upload.model';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '../../../node_modules/angularfire2/storage';
import { Observable } from '../../../node_modules/rxjs';
import { map } from '../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  basePath = 'Gallery';
  storageRef = this.storage;

  uploadCollection: AngularFirestoreCollection<Upload>;
  uploads$: Observable<Upload[]>;

  private percentage: Observable<number>;
  private snapshot: Observable<any>;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore) {
    this.uploadCollection = db.collection('gallery');

    this.uploads$ = this.uploadCollection.snapshotChanges().pipe(
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

  getUploadFiles() {
    return this.uploads$;
  }

  getUploadFile(path: string) {
    return this.storageRef.ref(path).getDownloadURL();
  }

  async pushUpload(fileToUpload: Upload, basePath: string) {
    fileToUpload.path = this.uploadPath(fileToUpload.person, basePath);
    const customMetadata = { app: 'Church-Mgr!' };

    if (fileToUpload.file.type.split('/')[0] !== 'image') {
      console.log('Unsupported file type :(' );
      return;
    }

    const uploadTask = this.storageRef.upload(fileToUpload.path, fileToUpload.file, {
      customMetadata: customMetadata
    });

    this.percentage = uploadTask.percentageChanges();
    this.snapshot = uploadTask.snapshotChanges();

    fileToUpload.url = (await uploadTask).downloadURL;
    fileToUpload.name = `${fileToUpload.person}_${new Date().getTime()}`;
    fileToUpload.createdDate = new Date();

    uploadTask.snapshotChanges().subscribe(resp => {
      fileToUpload.progress = (resp.bytesTransferred / resp.totalBytes) * 100;
    });

    this.saveFileData(fileToUpload);
  }

  deleteFile(file: Upload) {
    return this.deleteFileData(file.Id).then(() => {
      this.deleteFileStorage(file.path);
    });
  }

}


