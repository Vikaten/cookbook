import { Injectable } from '@angular/core';
import { Ingredient } from '../app/new-recipe/new-recipe.component';
import { BehaviorSubject } from 'rxjs';

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
  private recipesSubject = new BehaviorSubject<IRecipe[]>(this.recipesArr);

  saveData(newRecipe: IRecipe) {
    this.recipesArr.push(newRecipe);
    this.recipesSubject.next(this.recipesArr);
    console.log(this.recipesArr);
  }

  getRecipes() {
    console.log(this.recipesArr);
    return this.recipesSubject.asObservable();
  }
}
