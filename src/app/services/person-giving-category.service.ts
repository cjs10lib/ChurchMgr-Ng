import { Observable } from 'rxjs';
import { GivingCategory } from '../models/giving-category.model';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonGivingCategoryService {

  private givingCategoriesCollection: AngularFirestoreCollection<GivingCategory>;
  private givingCategories: Observable<GivingCategory[]>;

  constructor(private db: AngularFirestore) {
    this.givingCategoriesCollection = db.collection('giving-category');

    this.givingCategories = this.givingCategoriesCollection.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as GivingCategory;
          data.Id = a.payload.doc.id;

          return data;
        });
      }));
  }

  getGivingCategories() {
    return this.givingCategories;
  }

  addGivingCategories(category: GivingCategory) {
    category.lastUpdate = new Date();
    return this.db.collection('giving-category').add(category);
  }

  deleteGivingCategories(categoryId: string) {
    return this.db.doc(`giving-category/${categoryId}`).delete();
  }
}
