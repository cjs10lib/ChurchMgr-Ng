import { ConvertTimestampService } from './../custom-functions/convert-timestamp.service';
import { Observable } from 'rxjs';
import { PersonGroup } from './../models/person-group.model';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { map } from '../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeopleGroupService {

  groupCollection: AngularFirestoreCollection<PersonGroup>;
  groups$: Observable<PersonGroup[]>;

  constructor(private db: AngularFirestore, private timestampService: ConvertTimestampService) {
    this.groupCollection = db.collection('groups');

    this.groups$ = this.groupCollection.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data as PersonGroup;
          data.Id = a.payload.doc.id;

          return data;
        });
      }
    ));
  }

  getGroups() {
    return this.groups$;
  }

  addGroup(group: PersonGroup) {
    group.updatedAt = this.timestampService.getTimestamp;

    return this.groupCollection.add(group);
  }

}
