import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'})

export class AuthService {
    private isAuthenticated=false;
    private token!: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
        console.log(this.isAuthenticated);
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    login(username: string, password: string) {
        const authData: AuthData = {username: username, password:password};
        this.http.post<{token: string}>("http://localhost:3000/api/user/login", authData)
        .subscribe(response => {
            const token=response.token;
            this.token=token;
            if(token) {
                this.isAuthenticated=true;
                this.authStatusListener.next(true); //bsnavbar
                this.saveAuthData(token);
                this.router.navigate(['/']);
            }
        });
    }

    logout() {
        this.token='';
        this.isAuthenticated=false;
        this.authStatusListener.next(false);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private saveAuthData(token:string) {
        localStorage.setItem('token',token);
    }
    private clearAuthData() {
        localStorage.removeItem('token');
    }
    autoAuthUser() {
        const tokenn = localStorage.getItem('token');
        if(!tokenn) {
            this.token = '';
        }
        else {
            this.token = tokenn;             
            this.isAuthenticated = true;
            this.authStatusListener.next(true);       
        }
    }   
}