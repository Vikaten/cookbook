import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewRecipeComponent } from './new-recipe/new-recipe.component';
import { MainPageComponent } from './main-page/main-page.component';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';
import { MyRecipeCompleteComponent } from './my-recipe-complete/my-recipe-complete.component';
import {AuthComponent} from "./auth/auth.component";

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'home', component: MainPageComponent },
  { path: 'add-new-recipe', component: NewRecipeComponent },
  { path: 'my-recipes', component: MyRecipesComponent },
  { path: 'orders/:index', component: MyRecipeCompleteComponent },
  { path: 'edit-order/:id', component: NewRecipeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
