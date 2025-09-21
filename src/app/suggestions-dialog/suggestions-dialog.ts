import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

export interface SuggestionsDialogData {
  suggestions: string[];
}

@Component({
  selector: 'app-suggestions-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatListModule,
  ],
  templateUrl: './suggestions-dialog.html',
  styleUrl: './suggestions-dialog.scss'
})
export class SuggestionsDialog {
  readonly data = inject<SuggestionsDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SuggestionsDialog>);

  onCloseClick() {
    this.dialogRef.close();
  }

  onSuggestionSelect(suggestion: string) {
    this.dialogRef.close(suggestion);
  }
}
