import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as uuid from 'uuid';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showSignUpForm = false;
  showLoginForm = true;
  signUpUsername: string;
  signUpPassword: string;
  signUpEmail: string;
  loginUsername = '';
  loginPassword: string;
  sessionUser;
  constructor(private router: Router) { }

  ngOnInit() {
    if (!window.localStorage.getItem('Users')) {
      const adminId = uuid.v4().replace(/-/g, '');
      window.localStorage.setItem('Users',
        JSON.stringify([{ type: 'admin', username: 'admin', password: 'admin', email: 'admin@dev.com', uniqueId: adminId }]));
      window.localStorage.setItem('Subscribers',
        JSON.stringify([{ type: 'admin', username: 'admin', password: 'admin', email: 'admin@dev.com', uniqueId: adminId }]));
    }

  }

  onLogin() {
    if (this.loginUsername && this.loginPassword) {
      const existingData = JSON.parse(window.localStorage.getItem('Subscribers'));
      existingData.filter((res) => {
        if (res.username === this.loginUsername && res.password === this.loginPassword) {
          // route to other page
          this.sessionUser = res;
          console.log(this.sessionUser);
          this.router.navigate([`/home/${res.uniqueId}`]);
        }
      });
    }
  }

  onSignUp() { // showSignUpForm
    this.showSignUpForm = true;
    this.showLoginForm = false;
  }

  onSubmit() {
    if (this.signUpUsername && this.signUpPassword && this.signUpEmail) {
      const existingData = JSON.parse(window.localStorage.getItem('Subscribers'));
      existingData.push({
        type: 'subscriber', username: this.signUpUsername, password: this.signUpPassword,
        email: this.signUpEmail, uniqueId: uuid.v4().replace(/-/g, '')
      });
      window.localStorage.setItem('Subscribers', JSON.stringify(existingData));
      this.showSignUpForm = false;
      this.showLoginForm = true;
      alert('Please Login');
    } else {
      alert('Please give all details');
    }
  }

}
