import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

// interfaces are different from struct because they don't have any real value or memory during runtime (execution)
// They only exist at compile time to enforce better type safety to describe the shape of the object
export interface SignUpCredentials {
  username: string,
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // | operator means that the variable can be either a string or null
  // We use string | null here instead of private accessToken!: string, because the variable could be used before it is defined
  // And we're avoiding this and increasing the safety
  private accessToken: string | null = null
  private signUpURL = 'https://fullstacktodoapp-back-2-0.onrender.com/signup' 
  private loginURL = 'https://fullstacktodoapp-back-2-0.onrender.com/login'

  constructor(private http: HttpClient) { }

  async signUpUser(credentials: SignUpCredentials) {
    // Observables represent the data which is received over time, instead of getting all the data at once, they emit values gradually
    // They are lazy, which means if you do not subscribe to them (Tell them to start giving data), they won't do anything
    // HttpClient itself is an Observable 
    // pipe() is a method on Observables that let you chain operators
    // Operators can change the received data like call filter(), map(), etc.
    // Or they can be used for side effects, i.e things you want to do without changing the received data
    try {
      // <> syntax tells typescript what type of data the observable is going to receive, it's called a type parameter
      // firstValueFrom waits for the first value emitted by the observable
      // There's also lastValuefrom to read the last value 
      const response = await firstValueFrom(this.http.post<{accessToken: string}>(this.signUpURL, credentials))
      this.accessToken = response.accessToken
    } catch(err) {
      console.log(err)
      throw err // Exit the function incase an error occurs 
    }
  }
  
  
}
