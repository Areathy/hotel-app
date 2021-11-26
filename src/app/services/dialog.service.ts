import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { ChangeDatesComponent } from '../components/change-dates/change-dates.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private matDialog: MatDialog) { }

  openDateChangerDialog() {

    let dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = "dialog-box";
    dialogConfig.autoFocus = true;
    dialogConfig.width = "800px";

    this.matDialog.open(ChangeDatesComponent, dialogConfig);
  }
}
