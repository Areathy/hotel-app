import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { debounceTime, tap, switchMap, startWith, map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Hotel } from 'src/app/models/hotel';

import { HotelsService } from 'src/app/services/hotels.service';
import { CitiesService } from "../../services/cities.service";
import { RoomTypesService } from "../../services/room-types.service";
import { CountriesService } from 'src/app/services/countries.service';

import { City } from "../../models/city";
import { RoomType } from "../../models/room-type";
import { Extra } from 'src/app/models/extra';
import { Food } from 'src/app/models/food';
import { Country } from 'src/app/models/country';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, Extra {

  //properties
  formGroup!: FormGroup;
  cities: City[] = [];
  isCitiesLoading: boolean = false;
  hotels: Hotel[] = [];
  roomTypes: RoomType[] = [];
  countries: Country[] = [];

  minAdults: number = 1;
  maxAdults: number = 2;
  minChildren: number = 0;
  maxChildren: number = 2;

  //checkbox group
  allDineIn: any[] = [
    { id: 1, dineInName: "Breakfast" },
    { id: 2, dineInName: "Lunch" },
    { id: 3, dineInName: "Dinner" }
  ];

  allFoods: Food[] = [
    { name: "Fries" },
    { name: "Burger" },
    { name: "Chicken Combo" },
    { name: "Family Meal" },
    { name: "Non Veg Plater" },
    { name: "BBQ Burger" },
    { name: "Pizza" }
  ];

  foods: Food[] = [
    { name: "Fries" }
  ];

  filteredFoods!: Observable<Food[]>;

  separatorKeyCodes: number[] = [ENTER, COMMA];

  minDate: Date = new Date('1950-01-01');
  maxDate: Date = new Date('2010-01-01');
  startDate: Date = new Date('2002-01-01');

  @ViewChild('foodInput') foodInput!: ElementRef<HTMLInputElement>;

  constructor(private citiesService: CitiesService, private hotelsService: HotelsService,
    private roomTypesService: RoomTypesService, private countriesService: CountriesService) {
    //formgroup
    this.formGroup = new FormGroup({
      searchHotel: new FormGroup({
        city: new FormControl(null, [Validators.required]),
        checkIn: new FormControl(null, [Validators.required]),
        checkOut: new FormControl(null, [Validators.required]),
        adults: new FormControl(1, [Validators.min(1)]),
        children: new FormControl(0, [Validators.min(0)]),
      }),

      chooseHotel: new FormGroup({
        hotel: new FormControl(null, [Validators.required])
      }),

      chooseRoom: new FormGroup({
        roomType: new FormControl("Standard Single Room"),
        allDineIn: new FormControl(false),
        dineIn: new FormArray([]),
        foods: new FormControl(null),
        extraBed: new FormControl(false)
      }),

      personalInformation: new FormGroup({
        customerName: new FormControl(null, [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Za-z. ]*$')]),
        country: new FormControl(null, [Validators.required]),
        phone: new FormControl(null),
        dateOfBirth: new FormControl(null),
        gender: new FormControl(null)
      }),

      guestsInformation: new FormGroup({
        guest1Name: new FormControl(null),
        guest1Age: new FormControl(null),
        guest1Gender: new FormControl(null),
        guest2Name: new FormControl(null),
        guest2Age: new FormControl(null),
        guest2Gender: new FormControl(null)
      }), 

      payment: new FormGroup({
        creditCardNumber: new FormControl(null),
        cvv: new FormControl(null),
        giftCardNumber: new FormControl(null)
      }) 
    });

    //add dine in options
    this.allDineIn.forEach(() => {
      this.dineInFormArray!.push(new FormControl(false));
    });

    //chips with auto complete
    this.filteredFoods = this.getFormControl("chooseRoom.foods").valueChanges.pipe(
      startWith(''),
      map((food: string | null) => {
        if (food) {
          const filterValue = food.toLowerCase();
          return this.allFoods.filter(food => food.name.toLowerCase().indexOf(filterValue) == 0);
        } else {
          return this.allFoods.slice();
        }
      })
    );
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

    //hotels
    this.hotelsService.getHotels().subscribe(
      (response: Hotel[]) => {
        this.hotels = response;
      },
      (error) => {
        console.log(error);
      }
    );

    //room types
    this.roomTypesService.getRoomTypes().subscribe(
      (response: RoomType[]) => {
        this.roomTypes = response;
      },
      (error) => {
        console.log(error);
      }
    );

    //countries
    this.countriesService.getCountries().subscribe(
      (response: Country[]) => {
        this.countries = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get dineInFormArray(): FormArray | null {
    return this.formGroup.get("chooseRoom.dineIn") as FormArray;
  }

  //increase adults
  increaseAdults() {
    if (this.formGroup.value.searchHotel.adults < this.maxAdults) {
      this.getFormControl("searchHotel").patchValue({
        adults: this.formGroup.value.searchHotel.adults + 1
      });
    }
  }

  //decrease adults
  decreaseAdults() {
    if (this.formGroup.value.searchHotel.adults > this.minAdults) {
      this.getFormControl("searchHotel").patchValue({
        adults: this.formGroup.value.searchHotel.adults - 1
      });
    }
  }

  //increase children
  increaseChildren() {
    if (this.formGroup.value.searchHotel.children < this.maxChildren) {
      this.getFormControl("searchHotel").patchValue({
        children: this.formGroup.value.searchHotel.children + 1
      });
    }
  }

  //decrease children
  decreaseChildren() {
    if (this.formGroup.value.searchHotel.children > this.minChildren) {
      this.getFormControl("searchHotel").patchValue({
        children: this.formGroup.value.searchHotel.children - 1
      });
    }
  }

  chooseHotel(hotel: any) {
    this.getFormControl("chooseHotel").patchValue({
      hotel: hotel.hotelName
    });
  }

  isAllDineInSelected() {
    //if [true, true, true] then return true
    return this.dineInFormArray!.value.every((val: any) => val == true);
  }

  isNoDineInSelected() {
    //if [false, false, false] then return true
    return this.dineInFormArray!.value.every((val: any) => val == false);
  }

  //executes when the user clicks on "All" checkbox
  onAllDineInCheckBoxChange() {
    this.allDineIn.forEach((dineIn, index) => {
      this.dineInFormArray!.at(index).patchValue(this.getFormControl("chooseRoom.allDineIn").value);
    });
  }

  //executes when the user checks / unchecks any one of the three checkboxes
  onDineInChange(index: any) {
    if (this.isAllDineInSelected()) {
      this.getFormControl("chooseRoom").patchValue({ allDineIn: true });
    } else {
      this.getFormControl("chooseRoom").patchValue({ allDineIn: false });
    }
  }


  //returns the form control object based on the form control name
  getFormControl(controlName: string): FormControl {
    return this.formGroup.get(controlName) as FormControl;
  }

  //executes when the user presses ENTER or COMMA after typing some text
  add(event: MatChipInputEvent): void {
    //Add our food
    if ((event.value || '').trim()) {
      this.foods.push({ name: event.value.trim() })
    }

    this.getFormControl("chooseRoom").patchValue({ foods: null });
    this.foodInput.nativeElement.value = "";
  }

  //Executes when the user selects a specific item in the auto complete list
  selected(event: MatAutocompleteSelectedEvent): void {
    this.foods.push({ name: event.option.viewValue });
    this.getFormControl("chooseRoom").patchValue({ foods: null });
    this.foodInput.nativeElement.value = "";
  }

  //Executes when the user clicks on remove (X) button for a chip
  remove(food: Food): void {
    let index = this.foods.indexOf(food);

    if (index >= 0) {
      this.foods.splice(index, 1);
    }
  }

  //returns the error message based on the given control name and errorType
  getErrorMessage(controlName: string, errorType: string): string {
    let errorMessage: string = "";
    switch (controlName) {
      case "city": {
        if (errorType == "required") errorMessage = "You must choose a <strong>City</strong>";
      }
        break;

      case "checkIn": {
        if (errorType == "required") errorMessage = "You must enter a <strong>Check-In Date</strong>";
      }
        break;

      case "checkOut": {
        if (errorType == "required") errorMessage = "You must enter a <strong>Check-Out Date</strong>";
      }
        break;

      case "customerName": {
        if (errorType == "required") errorMessage = "You must specify a <strong>Name</strong>";
        else if (errorType == "maxlength") errorMessage = "<strong>Name</strong> can contain up to 30 characters only";
        else if (errorType == "pattern") errorMessage = "<strong>Name</strong> can contain alphabets or dot (.) or space only";
      };
        break;

      case "country": {
        if (errorType == "required") errorMessage = "You must choose a <strong>Country</strong>";
      }
    }

    return errorMessage;
  }


}
