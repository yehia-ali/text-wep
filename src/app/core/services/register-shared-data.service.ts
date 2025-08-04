import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterSharedDataService {

  constructor() { }
  private phone: any;
  private email: any;

  setPhone(phone: any) {
    this.phone = phone;
  }

  getPhone(): any {
    return this.phone || null;
  }

  setEmail(email: string) {
    this.email = email;
  }

  getEmail(): string {
    return this.email || null;
  }

}
