import { Component } from '@angular/core';
import { IRecipe, DataService } from '../data.service';
import { Router } from '@angular/router';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.scss'],
})
export class NewRecipeComponent {
  measurements: string[] = ['гр', 'кг', 'л', 'мл', 'чашки', 'стаканы', 'шт'];
  ingredients: Ingredient[] = [];
  ingredient: string = '';
  ingredientQuantity: number = 0;
  ingredientUnit: string = '';
  imageSrc: string | ArrayBuffer | null | undefined = null;
  nameRecipe: string = '';
  descriptionRecipe: string = '';
  imgRecipe: string = '';

  constructor(private dataService: DataService, private router: Router) {}

  addMeasurements() {
    if (
      this.ingredient !== '' &&
      this.ingredientQuantity > 0 &&
      this.ingredientUnit !== ''
    ) {
      const newIngredient: Ingredient = {
        name: this.ingredient,
        quantity: this.ingredientQuantity,
        unit: this.ingredientUnit,
      };
      this.ingredients.push(newIngredient);
      this.ingredient = '';
      this.ingredientQuantity = 0;
      this.ingredientUnit = '';
    } else {
      alert('ВВедите значения');
    }
  }

  onloadImg(e: Event) {
    const imgInput = e.target;
    const input = e.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      if (imgInput) {
        const inputTail = input.files[0].name.split('.').pop();
        const expansionImg = [
          'jpg',
          'jpeg',
          'gif',
          'png',
          'pdf',
          'ai',
          'eps',
          'tiff',
        ];
        if (expansionImg.includes(inputTail?.toLowerCase() || '')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imageSrc = e.target?.result;
          };
          reader.readAsDataURL(input.files[0]);
        } else {
          alert(
            'Вы добавили неверного формата изображение. Выберите другое с одним из следующих расширений: ' +
              expansionImg.join(', ')
          );
          input.value = '';
          this.imageSrc = null;
        }
      }
    }
  }

  submitData() {
    if (this.nameRecipe !== '' && this.descriptionRecipe !== '' && this.ingredients.length !== 0) {
      const recipe: IRecipe = {
        name: this.nameRecipe,
        ingredients: [...this.ingredients],
        description: this.descriptionRecipe,
        picture: this.imageSrc,
      };
      this.dataService.saveData(recipe);
      this.nameRecipe = '';
      this.descriptionRecipe = '';
      this.ingredients = [];
      this.imageSrc = null;

      alert('Ваш рецепт успешно добавлен!');
      this.router.navigate(['my-recipes']);
    }
    else {
      alert('Вы не ввели все данные');
    }
  }
}
