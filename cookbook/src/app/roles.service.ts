import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private roleId: number | null = null;

  constructor() { }

  setRole(roleId: number) {
    this.roleId = roleId;
    localStorage.setItem('roleId', roleId.toString());
  }

  getIsAdmin() {
    return localStorage.getItem('roleId') === '1';
  }

  clearRole() {
    this.roleId = null;
    localStorage.removeItem('roleId');
  }
}
