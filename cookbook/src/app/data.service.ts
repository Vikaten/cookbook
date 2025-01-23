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
  constructor() {
    const savedRecipes = localStorage.getItem('recipes');
    if (savedRecipes) {
      this.recipesArr = JSON.parse(savedRecipes);
      this.recipesSubject.next(this.recipesArr); // Обновляем поток
    }
  }
  private recipesArr: IRecipe[] = [];
  private recipesSubject = new BehaviorSubject<IRecipe[]>(this.recipesArr);
  savedRecipes = localStorage.getItem('recipes');

  saveData(newRecipe: IRecipe) {
    this.recipesArr.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(this.recipesArr));
    this.recipesSubject.next(this.recipesArr);
    console.log(this.recipesArr);
  }

  getRecipes() {
    console.log(this.recipesArr);
    return this.recipesSubject.asObservable();
  }
}
