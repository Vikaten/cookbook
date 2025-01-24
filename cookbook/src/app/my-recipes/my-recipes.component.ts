import { Component , OnInit} from '@angular/core';
import { IRecipe, DataService } from '../data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.scss'],
})
export class MyRecipesComponent {
  titleRecipe$: Observable<IRecipe[]> | undefined;
  constructor(public dataService: DataService, private router: Router) {}
  recipe: IRecipe | undefined;
  recipesArr: IRecipe[] = [];
  ngOnInit() {
    this.titleRecipe$ = this.dataService.getRecipes();
    this.dataService.getRecipes().subscribe((recipes) => {
      this.recipesArr = recipes;
    });
  }

  openRecipe(index: number) {
    this.dataService.openRecipe(index);
  }

  deleteRecipe(index: number) {
    this.dataService.deleteRecipe(index);
  }
}
