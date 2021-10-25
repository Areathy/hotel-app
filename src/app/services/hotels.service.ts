import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  urlPrefix: string = "http://localhost:7000";

  constructor(private httpClient: HttpClient) { }

  getHotels(): Observable<Hotel[]> {
    return this.httpClient.get<Hotel[]>(this.urlPrefix + `/hotels`);
  }}
