import { Injectable } from '@angular/core';
import { Ingredient } from '../app/new-recipe/new-recipe.component';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface IRecipe {
  name: string;
  ingredients: Ingredient[];
  description: string;
  picture: string | ArrayBuffer | null | undefined;
  savedDate?: Date;
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
  public selectedRecipeIndex: number | null = null;
  savedRecipes = localStorage.getItem('recipes');

  saveData(newRecipe: IRecipe) {
    newRecipe.savedDate = new Date();
    this.recipesArr.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(this.recipesArr));
    this.recipesSubject.next(this.recipesArr);
  }

  getRecipes() {
    return this.recipesSubject.asObservable();
  }

  openRecipe(index: number) {
    const recipe = this.recipesArr[index];
    this.selectedRecipeIndex = index;
    this.selectedRecipeSubject.next(recipe);
    this.router.navigate(['my-recipe-complete', index]);
    return recipe;
  }

  getSelectedRecipe() {
    return this.selectedRecipeSubject.asObservable();
  }

  updateData(updatedRecipe: IRecipe, index: number) {
    if (index >= 0 && index < this.recipesArr.length) {
      this.recipesArr[index] = updatedRecipe;
      updatedRecipe.savedDate = new Date();
      localStorage.removeItem('recipes');
      localStorage.setItem('recipes', JSON.stringify(this.recipesArr));
      this.recipesSubject.next(this.recipesArr);
    }
  }

  deleteRecipe(index: number) {
    this.recipesArr.splice(index, 1);
    localStorage.removeItem('recipes');
    localStorage.setItem('recipes', JSON.stringify(this.recipesArr));
    localStorage.getItem('recipes');
  }

  getRecipeByIndex(index: number): IRecipe | undefined {
    if (index >= 0 && index < this.recipesArr.length) {
      return this.recipesArr[index];
    }
    return undefined;
  }
}
