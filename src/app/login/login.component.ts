import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private isauthen = false;
  constructor(public authService: AuthService) { }
  isauthstring='';
  ngOnInit(): void {
  }

  onLogin(loginForm: NgForm) {
    // console.log(loginForm.value);
    this.authService.login(loginForm.value.username, loginForm.value.password);

    
    this.isauthen=this.authService.getIsAuth();
    if(!this.isauthen) {
      this.isauthstring='Logged in successfully!';
    }
    else {
      this.isauthstring='Not logged in yet!';
    }
  }
}
