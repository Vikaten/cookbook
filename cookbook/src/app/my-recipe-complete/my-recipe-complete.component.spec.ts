import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRecipeCompleteComponent } from './my-recipe-complete.component';

describe('MyRecipeCompleteComponent', () => {
  let component: MyRecipeCompleteComponent;
  let fixture: ComponentFixture<MyRecipeCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyRecipeCompleteComponent]
    });
    fixture = TestBed.createComponent(MyRecipeCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
