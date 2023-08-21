import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FormService {

  private countriesURL = environment.myApiUrl + '/countries';
  private stateURL = environment.myApiUrl + '/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesURL).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]> {
    const searchStatesUrl = `${this.stateURL}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

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

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  }
}
