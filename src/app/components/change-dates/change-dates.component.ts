import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Booking } from 'src/app/models/booking';
import { BookingsService } from 'src/app/services/bookings.service';

@Component({
  selector: 'app-change-dates',
  templateUrl: './change-dates.component.html',
  styleUrls: ['./change-dates.component.css']
})
export class ChangeDatesComponent implements OnInit {

  formGroup: FormGroup;
  isWorking: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: Booking, public matDialogRef: MatDialogRef<ChangeDatesComponent>,
  private bookingsService: BookingsService) { 
    this.formGroup = new FormGroup({
      checkIn: new FormControl(null),
      checkOut: new FormControl(null)
    });
  }

  ngOnInit(): void {
    //console.log(this.dialogData);
    this.formGroup.patchValue({
      checkIn: this.dialogData.checkIn,
      checkOut: this.dialogData.checkOut
    });
  }

  //Executes when the user clicks on Cancel / Close button
  onCancelClick() {
    this.matDialogRef.close();
  }

  onSaveClick() {
    this.isWorking = true;

    //send put request
    this.bookingsService.putBooking({ ...this.dialogData, ...this.formGroup.value }).subscribe(
      (response: Booking) => {
        //console.log(response);
        this.matDialogRef.close({ result: "Saved", data: response });
        this.isWorking = false;
      },
      (error) => {
        console.log(error);
        this.isWorking = false;
      }
    );
  }

}
 