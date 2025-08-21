import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

// interfaces are different from struct because they don't have any real value or memory during runtime (execution)
// They only exist at compile time to enforce better type safety to describe the shape of the object
export interface SignUpCredentials {
  username: string,
  email: string,
  password: string
}

export interface LoginCredentials {
  username: string,
  password: string
}

export interface DecodedToken {
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
  private storedToken: string | null = localStorage.getItem('accessToken')
  private accessToken: string | null = this.storedToken ? JSON.parse(this.storedToken) : null
  // private accessTokenSubject = new BehaviorSubject<string | null>(null)
  // If we don't mark the subject asObservable() other components will be able to call next() and emit their own tokens
  // accessToken$ = this.accessTokenSubject.asObservable() // $ sign is just a naming convention to mark the variable is an obseravble
  private isAuthenticating: boolean = false
  private decodedToken!: DecodedToken
  private signUpURL = 'https://fullstacktodoapp-back-2-0.onrender.com/signup' 
  private loginURL = 'https://fullstacktodoapp-back-2-0.onrender.com/login'
  private refreshURL = 'https://fullstacktodoapp-back-2-0.onrender.com/refresh'
  private logoutURL = 'https://fullstacktodoapp-back-2-0.onrender.com/logout'
  private passwordResetURL = 'https://fullstacktodoapp-back-2-0.onrender.com/password-reset'

  constructor(private http: HttpClient) { }

  // saveToStorage(accessToken: string | null) {
  //   localStorage.setItem('accessToken', JSON.stringify(accessToken))
  // }

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
      // Added {widthCredentials: true} to include cookies and store the refresh token 
      const response = await firstValueFrom(this.http.post<{accessToken: string}>(this.signUpURL, credentials, {withCredentials: true}))
      localStorage.setItem('accessToken', JSON.stringify(response.accessToken))
      // this.accessTokenSubject.next(response.accessToken)
      this.isAuthenticating = true
    } catch(err) { 
      console.log(err)
      throw new Error('Sign up failed.') // Exit the function incase an error occurs 
    }
  }

  async loginUser(credentials: LoginCredentials) {
    try {
      const response = await firstValueFrom(this.http.post<{accessToken: string}>(this.loginURL, credentials, {withCredentials: true}))
      localStorage.setItem('accessToken', JSON.stringify(response.accessToken))
      this.isAuthenticating = true
      const refreshToken = document.cookie.includes('refreshToken')
    } catch(err) {
      console.log(err)
      throw new Error('Login failed.')
    }
  }

  async logoutUser() {
    try {
      const res = await firstValueFrom(this.http.delete(this.logoutURL, {withCredentials: true}))
      localStorage.removeItem('accessToken')
    } catch(err) {
      console.log(err)
      throw new Error("Logout failed.")
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
    // null assertion operator '!' is used to denote that the value can't be null at this time
    this.decodedToken = jwtDecode(this.accessToken) // Assign the local decodedToken so we can access the username later
    return this.decodedToken.exp < Date.now() / 1000 // Current time, converting from seconds
  }

  async refreshAccessToken() {
    if (this.isAuthenticating) {
      return this.accessToken // return if authentication is happening
    }

    // Check if the access token is missing or has expired
    if (!this.accessToken || this.tokenIsExpired()) {
      this.isAuthenticating = true // Set the flag to true to prevent multiple refresh requests
      try {
        const res: RefreshedAccessToken = await firstValueFrom(
          // send cookies as well
          this.http.post<RefreshedAccessToken>(this.refreshURL, {}, {withCredentials: true}) 
        )
        // this.accessTokenSubject.next(res.accessToken)
        localStorage.setItem('accessToken', JSON.stringify(res.accessToken))
        return this.accessToken
      } catch(err) {
        console.log('Error while trying to get an access token on refresh: ', err)
        throw new Error('Failed to get a new access token')
      } finally {
        this.isAuthenticating = false // Release the lock so future login/sign ups can happen
      }
    }
    return this.accessToken // If the token isn't invalid or hasn't expired just return it
  }
  
  async resetPassword(credentials: LoginCredentials) {
    try {
      const res = await firstValueFrom(this.http.put<{accessToken: string}>(this.passwordResetURL, credentials, {withCredentials: true}))
      // Replaced the observable
      localStorage.setItem('accessToken', JSON.stringify(res.accessToken)) 
      this.isAuthenticating = true
    } catch (err: any) {
      console.log(err.error)
      throw new Error("Couldn't reset password")
    }
  }

  getAccessToken() {
    // Using value too much breaks the reactivep attern so .value method should be used sparingly
    return this.accessToken
  }
}
