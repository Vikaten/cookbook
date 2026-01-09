import {Component, OnInit} from '@angular/core';
import { IRecipe, DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

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
export class NewRecipeComponent implements OnInit {
  measurements: string[] = ['Красный бархат', 'Вишневый', 'Сникерс', 'Медовый', 'Банан-шоколад', 'Клубничный', 'Карамельный'];
  statusName: string[] = ['Новый', 'В процессе', 'Готов'];
  ingredients: Ingredient[] = [];
  ingredient: string = '';
  ingredientQuantity: number = 0;
  ingredientUnit: string = '';
  imageSrc: string | ArrayBuffer | null | undefined = null;
  fullName: string = '';
  descriptionRecipe: string = '';
  phone: string = '';
  email: string = '';
  orderDate: Date = new Date();
  dueDate: Date = new Date();
  status: string = 'Новый';
  imgRecipe: string = '';
  orderId: number | null = null;


  constructor(
    private dataService: DataService,
    private router: Router,
    private matDialog: MatDialog,
    private route: ActivatedRoute
  ) {}

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
      this.openModal('Введите значения!', 'Закрыть');
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
          this.openModal(
            'Вы добавили неверного формата изображение. Выберите другое с одним из следующих расширений: ', 'Закрыть' +
              expansionImg.join(', ')
          );
          input.value = '';
          this.imageSrc = null;
        }
      }
    }
  }

  submitData() {
    if (!this.fullName || !this.phone || !this.email || !this.orderDate) {
      this.openModal('Вы не ввели все данные', 'Закрыть');
      return;
    }

    const order = {
      FullName: this.fullName,
      Phone: this.phone,
      Email: this.email,
      OrderDate: this.orderDate.toISOString(),
      DueDate: this.dueDate.toISOString(),
      Status: this.status
    };
    console.log(order);

    if (this.orderId) {
      this.dataService.updateOrder(this.orderId, order).subscribe(() => {
        this.openModal('Заказ обновлён', 'Закрыть');
        this.router.navigate(['/orders']);
      });
    } else {
      this.dataService.createOrder(order).subscribe(() => {
        this.openModal('Заказ создан', 'Закрыть');
        this.router.navigate(['/orders']);
      });
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.orderId = +id;
      this.loadOrder(this.orderId);
    } else {
      this.resetForm();
    }
  }

  loadOrder(id: number) {
    this.dataService.getOrderById(id).subscribe(order => {
      this.fullName = order.FullName;
      this.phone = order.Phone;
      this.email = order.Email;
      this.orderDate = new Date(order.OrderDate);
      this.dueDate = order.DueDate;
      this.status = order.Status;
    });
  }


  resetForm() {
    this.fullName = '';
    this.descriptionRecipe = '';
    this.ingredients = [];
    this.imageSrc = null;
    this.phone = '';
    this.email = '';
    this.orderDate = new Date();
    this.dueDate = new Date();
    this.status = 'Новый'
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
  }

  openModal(text: string, buttonText: string) {
    this.matDialog.open(ModalComponent, {
      width: '400px',
      data: { message: text, buttonText },
    });
  }
}
