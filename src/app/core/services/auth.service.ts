import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = "https://api.escuelajs.co/api/v1";
  
  constructor() { }
}
