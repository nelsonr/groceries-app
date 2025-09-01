import {
  Component,
  input,
  output,
  viewChildren,
  effect,
  ElementRef,
  computed,
} from '@angular/core';
import { Grocery } from '../grocery';
import { Debounce } from '../debounce';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-groceries',
  imports: [
    Debounce,
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './groceries.html',
  styleUrl: './groceries.scss',
})
export class Groceries {
  public groceries = input.required<Grocery[]>();
  public focusIndex = input(0);
  public addEntry = output<number>();
  public updateEntry = output<Grocery>();
  public deleteEntry = output<number>();
  public cleanEntries = output<void>();

  protected checkedCount = computed(() => {
    return this.groceries().filter((item) => item.checked).length;
  });

  protected inputs = viewChildren<ElementRef>('groceryInput');

  constructor() {
    effect(() => {
      const index = this.focusIndex();
      const inputs = this.inputs();

      if (inputs[index]) {
        setTimeout(() => inputs[index].nativeElement.focus(), 0);
      }
    });
  }

  protected onKeyDown(ev: KeyboardEvent, index: number) {
    const target = ev.target as HTMLInputElement;
    const isInputEmpty = target.value.length === 0;
    const entriesCount = this.groceries().length;

    if (ev.key === 'Backspace' && isInputEmpty && entriesCount > 1) {
      this.deleteEntry.emit(index);
    }
  }

  protected onKeyUp(ev: KeyboardEvent, index: number) {
    if (ev.key === 'Enter') {
      this.addEntry.emit(index);
    }
  }

  protected onInput(value: string, index: number) {
    const entry = this.groceries().at(index);

    if (entry) {
      entry.text = value;
      this.updateEntry.emit(entry);
    }
  }

  protected onCheckboxChange(ev: MatCheckboxChange, index: number) {
    const entry = this.groceries().at(index);

    if (entry) {
      entry.checked = ev.checked;
      this.updateEntry.emit(entry);
    }
  }

  protected onCleanupClick() {
    this.cleanEntries.emit();
  }
}
