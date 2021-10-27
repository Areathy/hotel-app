import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomType } from '../models/room-type';

@Injectable({
  providedIn: 'root'
})
export class RoomTypesService {

  urlprefix: string = "http://localhost:7000";

  constructor(private httpClient: HttpClient) { }

  getRoomTypes(): Observable<RoomType[]> {
    return this.httpClient.get<RoomType[]>( this.urlprefix + `/roomtypes`);
  }

}
