import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewRecipeComponent } from './new-recipe/new-recipe.component';
import { MainPageComponent } from './main-page/main-page.component';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';
import { MyRecipeCompleteComponent } from './my-recipe-complete/my-recipe-complete.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'add-new-recipe', component: NewRecipeComponent },
  { path: 'my-recipes', component: MyRecipesComponent },
  { path: 'my-recipe-complete/:index', component: MyRecipeCompleteComponent },
  { path: 'edit-recipe/:index', component: NewRecipeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
