import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { City } from "../models/city"

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  urlPrefix: string = "http://localhost:7000";

  constructor(private httpClient: HttpClient)  { }

  getCities(searchText: string): Observable<City[]> {
    return this.httpClient.get<City[]>( this.urlPrefix + `/cities?cityName_like=^${searchText}`);
  }
}
