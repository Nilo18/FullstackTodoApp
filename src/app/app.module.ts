import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputComponent } from './components/input/input.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { PasswordResetVerificationComponent } from './pages/password-reset-verification/password-reset-verification.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    TasksComponent,
    HomepageComponent,
    SignupComponent,
    LoginComponent,
    HeaderComponent,
    PasswordResetComponent,
    EmailVerificationComponent,
    PasswordResetVerificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
