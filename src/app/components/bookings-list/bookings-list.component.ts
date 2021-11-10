import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { FormGroup, FormControl } from "@angular/forms";

import { Booking } from "../../models/booking";
import { BookingsService } from "../../services/bookings.service";

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.css']
})
export class BookingsListComponent implements OnInit {
  bookings: MatTableDataSource<Booking> = null as any;
  columnsToDisplay = ['customerName', 'checkIn', 'status', 'roomType', 'phone', 'actions'];
  bookingLoadingStatus: string = "Loading...";
  isLoadingCompleted: boolean = false;
  isError: boolean = false;
  rows: Booking[] = [];
  formGroup!: FormGroup;

  constructor(private bookingsService: BookingsService) {
    this.formGroup = new FormGroup({
      search: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.isLoadingCompleted = false;

    this.bookingsService.getBookings().subscribe(
      (response: Booking[]) => {
        this.bookings = new MatTableDataSource<Booking>(response);
        this.rows = response;

        this.isLoadingCompleted = true;

        //filterPredicate
        this.bookings.filterPredicate = (data, filter) => {
          return this.columnsToDisplay.some((column, i) => {
            return column != "actions" && column != "selection" && (data as any)[column] && (data as any)[column]
              .toString().toLowerCase().indexOf(filter) != -1;
          })
        }
      },
      (error) => {
        console.log(error);
        this.isError = true;
        this.bookingLoadingStatus = "Error fetching the data";
      },
    )
  }

  //Executes when the user changes the value of search textbox
  filterBookings() {
    if (this.formGroup.value.search != null && this.bookings) {
      this.bookings.filter = this.formGroup.value.search.trim();
    }
  }

}
