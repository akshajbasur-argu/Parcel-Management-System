
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-names-dialog',
  standalone: false,
  templateUrl: './select-names-dialog.html',
  styleUrl: './select-names-dialog.css',
})


export class SelectNamesDialog {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: OCRName[],
    private dialogRef: MatDialogRef<SelectNamesDialog>
  ) { 
    console.log(data)
  }

  toggle(item: OCRName) {
    item.selected = !item.selected;
  }

  close() {
    this.dialogRef.close(null);
  }

  confirm() {
    const selected = this.data.filter(d => d.selected);
    this.dialogRef.close(selected);
  }
}

interface OCRName {
  name: string;
  score: number;
  selected?: boolean;
}