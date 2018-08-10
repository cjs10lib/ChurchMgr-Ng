import { ConvertTimestampService } from './convert-timestamp.service';
import { Observable } from 'rxjs';
import { PersonGroup } from './../models/person-group.model';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { map } from '../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeopleGroupService {

  private groupCollection: AngularFirestoreCollection<PersonGroup>;
  private groups$: Observable<PersonGroup[]>;

  constructor(private db: AngularFirestore, private timestampService: ConvertTimestampService) {
    this.groupCollection = db.collection('groups');

    this.groups$ = this.groupCollection.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as PersonGroup;
          data.Id = a.payload.doc.id;

          return data;
        });
      }
    ));
  }

  getGroups() {
    return this.groups$;
  }

  getGroup(groupId: string): Observable<PersonGroup> {
    return this.db.doc(`groups/${groupId}`).valueChanges();
  }

  addGroup(group: PersonGroup) {
    group.updatedAt = this.timestampService.getTimestamp;

    return this.groupCollection.add(group);
  }

  updateGroup(groupId: string, group: PersonGroup) {
    return this.db.doc(`groups/${groupId}`).set(group, {merge: true});
  }

  deleteGroup(groupId: string) {
    return this.db.doc(`groups/${groupId}`).delete();
  }

}
