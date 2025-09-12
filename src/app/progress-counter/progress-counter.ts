import { Component, computed, input, signal } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-progress-counter',
  imports: [MatProgressBar],
  templateUrl: './progress-counter.html',
  styleUrl: './progress-counter.scss'
})
export class ProgressCounter {
  public label = input.required<string>();
  public value = input.required<number>();
  public maxValue = input.required<number>();

  protected percent = computed(() => {
    return (this.value() / this.maxValue()) * 100;
  });
}
