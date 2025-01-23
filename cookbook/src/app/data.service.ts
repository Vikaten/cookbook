import { Injectable } from '@angular/core';
import { Ingredient } from '../app/new-recipe/new-recipe.component';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

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
  constructor(private router: Router) {
    const savedRecipes = localStorage.getItem('recipes');
    if (savedRecipes) {
      this.recipesArr = JSON.parse(savedRecipes);
      this.recipesSubject.next(this.recipesArr);
    }
  }
  private recipesArr: IRecipe[] = [];
  public recipesSubject = new BehaviorSubject<IRecipe[]>(this.recipesArr);
  public selectedRecipeSubject = new BehaviorSubject<IRecipe | null>(null);
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

  openRecipe(index: number) {
    const recipe = this.recipesArr[index];
    this.selectedRecipeSubject.next(recipe);
    this.router.navigate(['my-recipe-complete']);
    console.log(recipe);
    return recipe;
  }

  getSelectedRecipe() {
    return this.selectedRecipeSubject.asObservable();
  }
}
