import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";

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

  constructor(private bookingsService: BookingsService) { }

  ngOnInit(): void {
    this.isLoadingCompleted = false;

    this.bookingsService.getBookings().subscribe(
      (response: Booking[]) => {
        this.bookings = new MatTableDataSource<Booking>(response);
        this.rows = response;
        
        this.isLoadingCompleted = true;
      },
      (error) => {
        console.log(error);
        this.isError = true;
        this.bookingLoadingStatus = "Error fetching the data";
      },
    )
  }

}
