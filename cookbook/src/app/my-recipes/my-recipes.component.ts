import { Component , OnInit} from '@angular/core';
import { IRecipe, DataService } from '../data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.scss'],
})

export class MyRecipesComponent  {
  titleRecipe$: Observable<IRecipe[]> | undefined;
  constructor(private dataService: DataService) {}
  recipe: IRecipe | undefined;
  ngOnInit() {
    this.titleRecipe$ = this.dataService.getRecipes();
  }
}
