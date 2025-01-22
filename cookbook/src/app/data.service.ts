import { Injectable } from '@angular/core';
import { Ingredient } from '../app/new-recipe/new-recipe.component';

export interface IRecipe {
  name: string;
  ingredients: Ingredient[];
  description: string;
  picture: string | ArrayBuffer | null | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private recipesArr: IRecipe[] = [];

  saveData(newRecipe: IRecipe) {
    this.recipesArr.push(newRecipe);
    console.log(this.recipesArr);
  }

  getRecipes() {
    return this.recipesArr;
  }
}
