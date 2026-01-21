import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {RolesService} from "../roles.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  constructor(private router: Router, protected rolesService: RolesService) { }
  addRecipe() {
    this.router.navigate(['add-new-recipe']);
  }

  goToRecipe() {
    this.router.navigate(['my-recipes']);
  }
}
