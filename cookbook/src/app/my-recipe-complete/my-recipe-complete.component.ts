import { Component } from '@angular/core';
import { DataService, IRecipe } from '../data.service';

@Component({
  selector: 'app-my-recipe-complete',
  templateUrl: './my-recipe-complete.component.html',
  styleUrls: ['./my-recipe-complete.component.scss'],
})
export class MyRecipeCompleteComponent {
  recipe: IRecipe | null = null;
  constructor(private dataService: DataService) {}
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
}
