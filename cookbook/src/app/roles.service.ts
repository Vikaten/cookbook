import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private roleId: number | null = null;

  constructor() { }

  setRole(roleId: number) {
    this.roleId = roleId;
  }

  getIsAdmin() {
    return this.roleId === 1;
  }
}
