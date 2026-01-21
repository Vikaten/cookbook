import { Component , OnInit} from '@angular/core';
import { IRecipe, DataService } from '../data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { Order } from '../data.service'
import {RolesService} from "../roles.service";

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.scss'],
})

export class MyRecipesComponent implements OnInit {
  orders$!: Observable<Order[]>;
  constructor(
    public dataService: DataService,
    private router: Router,
    private matDialog: MatDialog,
    protected rolesService: RolesService,
  ) {}
  recipe: IRecipe | undefined;
  ngOnInit() {
    this.orders$ = this.dataService.getOrders();
    this.orders$.subscribe(orders => {console.log(orders);});
  }

  openOrder(orderId: number) {
    this.router.navigate(['/orders', orderId]);
  }

  deleteOrder(orderId: number) {
    const dialogRef = this.openModal('Вы точно хотите удалить заказ?', 'Удалить');

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteOrder(orderId).subscribe(() => {
          this.orders$ = this.dataService.getOrders();
        });
      }
    });
  }

  openModal(text: string, buttonText: string): MatDialogRef<ModalComponent> {
    return this.matDialog.open(ModalComponent, {
      width: '400px',
      data: { message: text, buttonText },
    });
  }
}
