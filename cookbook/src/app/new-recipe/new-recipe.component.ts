import {Component, OnInit} from '@angular/core';
import { DataService } from '../data.service';
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
  descriptionRecipe: Event | undefined;
  phone: string = '';
  email: string = '';
  orderDate: Date = new Date();
  dueDate: Date | null = new Date();
  status: string = 'Новый';
  comment: string = '';
  items: any = [];
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
    if (!this.fullName || !this.phone || !this.orderDate || !this.dueDate) {
      this.openModal('Вы не ввели все данные', 'Закрыть');
      return;
    }

    const orderPayload = {
      fullName: this.fullName,
      phone: this.phone,
      email: this.email,
      orderDate: this.orderDate.toISOString(),
      dueDate: this.dueDate.toISOString(),
      status: this.status,
      comment: this.comment ?? '',
      items: this.ingredients.map(i => ({
        productName: i.name,
        decoration: i.unit,
        quantity: i.quantity
      }))
    };

    if (this.isEditMode && this.orderId) {
      this.updateOrder(orderPayload);
    } else {
      this.createOrder(orderPayload);
    }
  }

  createOrder(order: any) {
    this.dataService.createOrder(order).subscribe({
      next: () => {
        this.openModal('Заказ создан', 'Закрыть');
        this.router.navigate([`/orders/${order.id}`]);
      },
      error: err => {
        console.error(err);
        this.openModal(err.error?.message || 'Ошибка', 'Закрыть');
      }
    });
  }

  updateOrder(order: any) {
    this.dataService.updateOrder(this.orderId!, order).subscribe({
      next: () => {
        this.openModal('Заказ обновлён', 'Закрыть');
        this.router.navigate([`/orders/${this.orderId}`]);
      },
      error: err => {
        console.error(err);
        this.openModal(err.error?.message || 'Ошибка обновления', 'Закрыть');
      }
    });
  }

  isEditMode = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.orderId = +id;
      this.loadOrder(this.orderId);
    } else {
      this.resetForm();
    }
  }

  loadOrder(id: number) {
    this.dataService.getOrderById(id).subscribe({
      next: order => {
        this.fullName = order.FullName;
        this.phone = order.Phone;
        this.email = order.Email;
        this.orderDate = new Date(order.OrderDate);
        this.dueDate = order.DueDate ? new Date(order.DueDate) : null;
        this.status = order.Status;

        this.ingredients = (order.Items ?? []).map((i: any) => ({
          name: i.ProductName,
          quantity: i.Quantity,
          unit: i.Decoration
        }));
      },
      error: err => {
        console.error('Ошибка загрузки заказа:', err);
      }
    });
  }


  resetForm() {
    this.fullName = '';
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
