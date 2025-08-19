import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

// interfaces are different from struct because they don't have any real value or memory during runtime (execution)
// They only exist at compile time to enforce better type safety to describe the shape of the object
export interface SignUpCredentials {
  username: string,
  email: string,
  password: string
}

interface DecodedToken {
  userId: number,
  username: string,
  exp: number
}

interface RefreshedAccessToken {
  accessToken: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // | operator means that the variable can be either a string or null
  // We use string | null here instead of private accessToken!: string, because the variable could be used before it is defined
  // And we're avoiding this and increasing the safety
  private accessToken: string | null = null
  private decodedToken!: DecodedToken
  private signUpURL = 'https://fullstacktodoapp-back-2-0.onrender.com/signup' 
  private loginURL = 'https://fullstacktodoapp-back-2-0.onrender.com/login'
  private refreshURL = 'https://fullstacktodoapp-back-2-0.onrender.com/refresh'

  constructor(private http: HttpClient) { }

  async signUpUser(credentials: SignUpCredentials) {
    // Observables represent the data which is received over time, instead of getting all the data at once, they emit values gradually
    // They are lazy, which means if you do not subscribe to them (Tell them to start giving data), they won't do anything
    // HttpClient itself is an Observable 
    // pipe() is a method on Observables that let you chain operators
    // Operators can change the received data like call filter(), map(), etc.
    // Or they can be used for side effects, i.e things you want to do without changing the received data
    try {
      console.log('Loading...')
      // <> syntax tells typescript what type of data the observable is going to receive, it's called a type parameter
      // firstValueFrom waits for the first value emitted by the observable
      // There's also lastValuefrom to read the last value
      // Added {widthCredentials: true} to include cookies and store the refresh token 
      const response = await firstValueFrom(this.http.post<{accessToken: string}>(this.signUpURL, credentials, {withCredentials: true}))
      this.accessToken = response.accessToken
      console.log('Access token: ', this.accessToken)
    } catch(err) { 
      console.log(err)
      throw err // Exit the function incase an error occurs 
    }
  }

  // !! turns a value into boolean, if string is valid true will be returned because all strings except for '' are truthy
  // If the accessToken is null false will be returned because null is falsy
  hasToken(): boolean {
    return !!this.accessToken
  }
  
  tokenIsExpired(): boolean {
    // If the accessToken is null, that doesn't mean that it is expired, just missing, so just ignore it
    if (!this.accessToken) { 
      return false;
    }
    // Decode the token to check if it expired or not
    this.decodedToken = jwtDecode(this.accessToken) // Assign the local decodedToken so we can access the username later
    return this.decodedToken.exp < Date.now() / 1000 // Current time, converting from seconds
  }

  async refreshAccessToken() {
    // Reverse the condition from hasToken(), if true is returned (token exists) then ! will negate it and null will be returned
    // i.e token won't be refreshed 
    if (!this.hasToken()) { 
      return null
    }
    if (this.tokenIsExpired()) {
      const res: RefreshedAccessToken = await firstValueFrom(
        this.http.post<RefreshedAccessToken>(this.refreshURL, {username: this.decodedToken.username})
      )
      this.accessToken = res.accessToken
      console.log('Access token: ', this.accessToken)
      return this.accessToken
    }
    return this.accessToken // If the token isn't invalid or hasn't expired just return it
  }
  
  getAccessToken() {
    return this.accessToken  
  }
}
