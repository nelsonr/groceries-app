import { Component, input, output } from '@angular/core';
import { Grocery } from '../grocery';
import { Debounce } from '../debounce';

@Component({
  selector: 'app-groceries',
  imports: [
    Debounce
  ],
  templateUrl: './groceries.html',
  styleUrl: './groceries.scss'
})
export class Groceries {
  public groceries = input.required<Grocery[]>()
  public addEntry = output<number>()
  public updateEntry = output<Grocery>();
  public deleteEntry = output<number>()

  protected onKeyDown(ev: KeyboardEvent, index: number) {
    const target = ev.target as HTMLInputElement

    if (ev.key === "Backspace" && target.value.length === 0) {
      this.deleteEntry.emit(index)
    }
  }

  protected onKeyUp(ev: KeyboardEvent, index: number) {
    if (ev.key === "Enter") {
      this.addEntry.emit(index)
    }
  }

  protected onInput(value: string, index: number) {
    const entry = this.groceries().at(index)

    if (entry) {
      entry.text = value
      this.updateEntry.emit(entry)
    }
  }

  protected onCheckboxChange(ev: Event, index: number) {
    const target = ev.target as HTMLInputElement;
    const entry = this.groceries().at(index)

    if (entry) {
      entry.checked = target.checked;
      this.updateEntry.emit(entry)
    }
  }
}
