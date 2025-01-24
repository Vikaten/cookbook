import { Component } from '@angular/core';
import { DataService, IRecipe } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-recipe-complete',
  templateUrl: './my-recipe-complete.component.html',
  styleUrls: ['./my-recipe-complete.component.scss'],
})
export class MyRecipeCompleteComponent {
  recipe: IRecipe | null = null;
  constructor(private dataService: DataService, private router: Router) {}
  ngOnInit() {
    let recipeStored;
    recipeStored = localStorage.getItem('recipe');
    if (recipeStored) {
      this.recipe = JSON.parse(recipeStored);
    }
    this.dataService.getSelectedRecipe().subscribe((recipe) => {
      if (recipe) {
        this.recipe = recipe;
        localStorage.setItem('recipe', JSON.stringify(this.recipe));
      }
    });
  }

  editRecipe() {
    this.router.navigate(['add-new-recipe']);
  }
}
