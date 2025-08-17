import { Injectable } from '@angular/core';
import { Grocery } from './grocery';

@Injectable({
  providedIn: 'root'
})
export class GroceriesStore {
  public getList(): Grocery[] {
    const data = window.localStorage.getItem("groceries");

    if (!data) {
      return [
        {
          id: crypto.randomUUID(),
          checked: false,
          text: ""
        }
      ]
    } else {
      return JSON.parse(data) as Grocery[];
    }
  }

  public updateList(list: Grocery[]) {
    window.localStorage.setItem("groceries", JSON.stringify(list));
  }
}
