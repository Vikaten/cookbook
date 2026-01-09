import { Component } from '@angular/core';
import { DataService, IRecipe } from '../data.service';
import { Router } from '@angular/router';
import { Ingredient } from '../new-recipe/new-recipe.component';
import {RolesService} from "../roles.service";

@Component({
  selector: 'app-my-recipe-complete',
  templateUrl: './my-recipe-complete.component.html',
  styleUrls: ['./my-recipe-complete.component.scss'],
})
export class MyRecipeCompleteComponent {
  recipe: IRecipe | null = null;
  recipeIndex: number | null = null;
  constructor(private dataService: DataService, private router: Router, protected rolesService: RolesService) { }
  // ngOnInit() {
  //   this.dataService.getSelectedRecipe().subscribe((recipe) => {
  //     if (recipe) {
  //       this.recipe = recipe;
  //       this.recipeIndex = this.dataService.selectedRecipeIndex;
  //       localStorage.setItem('recipe', JSON.stringify(this.recipe));
  //     }
  //   });
  // }

  editRecipe() {
    if (this.recipeIndex !== null) {
      this.router.navigate(['edit-recipe', this.recipeIndex]);
    }
  }
}
