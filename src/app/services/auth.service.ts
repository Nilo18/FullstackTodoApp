import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AbstractControl } from '@angular/forms';

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

export interface PasswordResetCredentials {
  email: string,
  username: string
}

export interface DecodedToken {
  userId: number,
  username: string,
  exp: number
}

interface RefreshedAccessToken {
  accessToken: string
}

interface verificationToken {
    userId: number,
    username: string,
    token: string,
    expiry: Date,
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
  private emailVerificationURL = 'https://fullstacktodoapp-back-2-0.onrender.com/verify-email/'

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
      // localStorage.setItem('accessToken', JSON.stringify(response.accessToken))
      // this.accessTokenSubject.next(response.accessToken)
      this.isAuthenticating = true
    } catch(err) { 
      console.log(err)
      throw err // Rethrow the error directly so it's message property is accessible
    }
  }

  async loginUser(credentials: LoginCredentials) {
    try {
      const response = await firstValueFrom(this.http.post<{accessToken: string}>(this.loginURL, credentials, {withCredentials: true}))
      localStorage.setItem('accessToken', JSON.stringify(response.accessToken))
      this.isAuthenticating = true
    } catch(err: any) {
      console.log(err)
      throw err
    }
  }

  async verifyEmail(token: string) {
    try {
      const res = await firstValueFrom(this.http.get<{accessToken: string}>(`${this.emailVerificationURL}${token}`))
      localStorage.setItem('accessToken', JSON.stringify(res.accessToken))
      return res.accessToken
    } catch (err) {
      console.log('Error while trying to verify the email: ', err)
      throw err
    }
  }

  logoutUser() {
    try {
      localStorage.removeItem('accessToken')
    } catch(err) {
      console.log('Failed to log out: ', err)
      throw err
    }
  }

  // !! turns a value into boolean, if string is valid true will be returned because all strings except for '' are truthy
  // If the accessToken is null false will be returned because null is falsy
  hasToken(): boolean {
    return !!this.accessToken
  }

  // This is for sending the password reset request on email
  async resetPasswordReq(credentials: PasswordResetCredentials) {
    try {
      const res = await firstValueFrom(this.http.post(this.passwordResetURL, credentials, {withCredentials: true}))
      // Replaced the observable
      // localStorage.setItem('accessToken', JSON.stringify(res.accessToken)) 
      this.isAuthenticating = true
    } catch (err: any) {
      console.log('Failed to send password reset request: ',err)
      throw err
    }
  }

  // This is for resetting the password
  async resetPassword(newPassword: string, token: string | null) {
    try {
      const res = await firstValueFrom(this.http.put<{accessToken: string}>(`${this.passwordResetURL}/${token}`, newPassword, {withCredentials: true}))
      localStorage.setItem('accessToken', JSON.stringify(res.accessToken))
    } catch (err: any) {
      console.log("Couldn't reset password.")
      throw err
    } 
  }

  getAccessToken() {
    // Using value too much breaks the reactivep attern so .value method should be used sparingly
    return this.accessToken
  }
}
