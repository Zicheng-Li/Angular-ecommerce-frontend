import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }
  getMonth(month: number): Observable<number[]> {
    let data: number[] = [];
    // build an array for "Month" dropdown
    for (let i = month; i <= 12; i++) {
      data.push(i);
    }
    return of(data); // the of will wrap the array in an observable
  }

  getYear(): Observable<number[]> {
    let data: number[] = [];
    // build an array for "Year" dropdown
    // start an current year and end with 10 years later
    const year: number=new Date().getFullYear();
    console.log(year);
    for (let i = year; i <= year + 10; i++) {
      data.push(i);
    }
    return of(data); // the of will wrap the array in an observable
  }

}
