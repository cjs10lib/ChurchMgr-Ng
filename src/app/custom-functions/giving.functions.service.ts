import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GivingFunctionsService {

  constructor() { }

  private distinctArraySummary(arrayData) {

    return arrayData.reduce((map, category) => {

      const categeory = category.data.category;
      const amount = + category.data.amount;

      map[categeory] = (map[categeory] || 0) + amount;

      return map;

    }, {});
  }

  getArrayDistinctSumary(arrayData) {
    const arraySum = this.distinctArraySummary(arrayData);

    return Object.keys(arraySum).map(category => {
      return {
        category: category,
        totalAmount: arraySum[category]
      };
    });
  }
  
  getTotalAmount(arrayData) {
    // + operator for casting to Number
    return arrayData.reduce((a, b) => +a + +b.data.amount, 0);
  }

}
