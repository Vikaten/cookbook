import { Component , OnInit} from '@angular/core';
import { IRecipe, DataService } from '../data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.scss'],
})
export class MyRecipesComponent {
  titleRecipe$: Observable<IRecipe[]> | undefined;
  constructor(
    public dataService: DataService,
    private router: Router,
    private matDialog: MatDialog
  ) {}
  recipe: IRecipe | undefined;
  recipesArr: IRecipe[] = [];
  // ngOnInit() {
  //   this.titleRecipe$ = this.dataService.getRecipes();
  //   this.dataService.getRecipes().subscribe((recipes) => {
  //     this.recipesArr = recipes;
  //   });
  // }
  //
  // openRecipe(index: number) {
  //   this.dataService.openRecipe(index);
  // }
  //
  // deleteRecipe(index: number) {
  //   const dialogRef = this.openModal('Вы точно хотите удалить?', 'Удалить');
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.dataService.deleteRecipe(index);
  //     }
  //   });
  // }

  saveRecipe(recipe: IRecipe) {
    recipe.savedDate = new Date();
  }

  openModal(text: string, buttonText: string): MatDialogRef<ModalComponent> {
    return this.matDialog.open(ModalComponent, {
      width: '400px',
      data: { message: text, buttonText },
    });
  }
}
