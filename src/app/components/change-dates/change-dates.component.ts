import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Booking } from 'src/app/models/booking';

@Component({
  selector: 'app-change-dates',
  templateUrl: './change-dates.component.html',
  styleUrls: ['./change-dates.component.css']
})
export class ChangeDatesComponent implements OnInit {

  formGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: Booking) { 
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

}
