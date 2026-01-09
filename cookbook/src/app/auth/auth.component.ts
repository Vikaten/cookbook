import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {DataService} from "../data.service";
import {Router} from "@angular/router";
import {RolesService} from "../roles.service";

export interface IAuth {
  message: string;
  roleId: number;
  userId: number;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  @ViewChild('login') login: ElementRef | undefined;
  @ViewChild('password') password: ElementRef | undefined;

  private dataService: DataService = inject(DataService);
  private router: Router = inject(Router);
  private rolesService: RolesService = inject(RolesService);


  logIn() {
    const login = this.login?.nativeElement.value;
    const password = this.password?.nativeElement.value;

    if (!login || !password) {
      alert('Введите логин и пароль');
      return;
    }

    this.dataService.login({ login, password }).subscribe({
      next: (res: IAuth) => {
        alert(res.message);
        this.rolesService.setRole(res.roleId);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        alert(err.error.message || 'Ошибка входа');
      }
    });
  }
}
