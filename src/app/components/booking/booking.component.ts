import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { debounceTime, tap, switchMap, startWith, map } from "rxjs/operators";

import { City } from "../../models/city";
import { CitiesService } from "../../services/cities.service";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  //properties
  formGroup!: FormGroup;
  cities: City[] = [];
  isCitiesLoading: boolean = false;

  constructor(private citiesService: CitiesService) { 
    //formgroup
    this.formGroup = new FormGroup({
      searchHotel: new FormGroup({
        city: new FormControl(null, [Validators.required]),
        checkIn: new FormControl(null, [Validators.required]),
        checkOut: new FormControl(null, [Validators.required]),
        adults: new FormControl(1, [Validators.min(1)]),
        children: new FormControl(0, [Validators.min(0)]),
      })
    });
  }

  ngOnInit(): void { 
    //cities (autocomplete)
    this.getFormControl("searchHotel.city").valueChanges
      .pipe(
        //debounce: wait for at least 500 milliseconds, after typing in the textbox
        debounceTime(500),

        //tap: do something before making request
        tap(() => {
          this.cities = [];
          this.isCitiesLoading = true;
        }),

        //switchMap: to make http request
        switchMap(value => this.citiesService.getCities(value))
      ) 
      .subscribe(
        (response: City[]) => {
          this.cities = response;
          this.isCitiesLoading = false;
        },

        (error) => {
          console.log(error);
          this.isCitiesLoading = false;
        }
      );
  }

  //returns the form control object based on the form control name
  getFormControl(controlName: string): FormControl {
    return this.formGroup.get(controlName) as FormControl;
  }

}
