import { Visitor } from './../models/person-visitor.model';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { map } from '../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeopleVisitorService {

  private visitorCollection: AngularFirestoreCollection<Visitor>;
  private visitors$: Observable<Visitor[]>;

  constructor(private db: AngularFirestore) {
    this.visitorCollection = db.collection('visitors');

    this.visitors$ = this.visitorCollection.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Visitor;
          data.Id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getVisitors() {
    return this.visitors$;
  }

  getVisitor(visitorId: string) {
    return this.visitorCollection.doc(visitorId).valueChanges();
  }

  addVisitor(visitor: Visitor) {
    visitor.created = new Date;
    visitor.fullname = visitor.surname + ' ' + visitor.firstname + ' ' + visitor.othernames;

    return this.visitorCollection.add(visitor);
  }

  updateVisitor(visitorId: string, visitor: Visitor) {
    visitor.created = new Date;
    visitor.fullname = visitor.surname + ' ' + visitor.firstname + ' ' + visitor.othernames;

    return this.visitorCollection.doc(visitorId).set(visitor);
  }

  deleteVisitor(visitorId: string) {
    return this.visitorCollection.doc(visitorId).delete();
  }
}
