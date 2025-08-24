import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuardGuard } from './guards/auth-guard.guard';
import { signupBlockerGuard } from './guards/signup-blocker.guard';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';

// pathMatch controls how the router matches the URL against a route's path
const routes: Routes = [
  // redirectTo makes sure that if the user hits the base URL, they will be redirected to sign up page
  {path: '', redirectTo: 'signup', pathMatch: 'full'},
  {path: 'signup', component: SignupComponent, canActivate: [signupBlockerGuard]},
  {path: 'verify-email/:token', component: EmailVerificationComponent},
  {path: 'home', component: HomepageComponent, canActivate: [authGuardGuard]},
  {path: 'login', component: LoginComponent, canActivate: [signupBlockerGuard]},
  {path: 'password-reset', component: PasswordResetComponent, canActivate: [signupBlockerGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
