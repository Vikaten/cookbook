import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPageComponent } from './main-page/main-page.component';
import { NewRecipeComponent } from './new-recipe/new-recipe.component';
import { MyRecipeComponent } from './my-recipe/my-recipe.component';
import { MyRecipeCompleteComponent } from './my-recipe-complete/my-recipe-complete.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    NewRecipeComponent,
    MyRecipeComponent,
    MyRecipeCompleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
