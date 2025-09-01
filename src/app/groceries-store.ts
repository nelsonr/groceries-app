import { Injectable } from '@angular/core';
import { Grocery } from './grocery';

@Injectable({
  providedIn: 'root',
})
export class GroceriesStore {
  public getList(): Grocery[] {
    const data = window.localStorage.getItem('groceries');

    return this.parseData(data);
  }

  public updateList(list: Grocery[]) {
    window.localStorage.setItem('groceries', JSON.stringify(list));
  }

  private parseData(data: string | null): Grocery[] {
    if (data) {
      const result = JSON.parse(data);

      if (Array.isArray(result) && result.length > 0) {
        return result as Grocery[];
      }
    }

    return [
      {
        id: GroceriesStore.randomId(),
        checked: false,
        text: '',
      },
    ];
  }

  public static randomId(): string {
    const numbers = [];

    for (let i = 0; i < 4; i++) {
      const n = Math.ceil(Math.random() * 10000);
      numbers.push(n);
    }

    return numbers.join('-');
  }
}
