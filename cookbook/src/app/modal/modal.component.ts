import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(
    private matDialog: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { message: string; buttonText: string }
  ) {}
  close() {
    this.matDialog.close();
    this.matDialog.close(true);
  }
}
