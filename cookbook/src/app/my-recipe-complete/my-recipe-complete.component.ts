import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { DataService } from '../data.service';
import { RolesService } from '../roles.service';
import { Order } from '../data.service'

@Component({
  selector: 'app-my-recipe-complete',
  templateUrl: './my-recipe-complete.component.html',
  styleUrls: ['./my-recipe-complete.component.scss'],
})
export class MyRecipeCompleteComponent implements OnInit {
  order: Order | null = null;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    protected rolesService: RolesService
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.params['index'];
    this.dataService.getOrderDetails(orderId).subscribe({
      next: (order) => {
        this.order = order;
      },
      error: () => {
        console.error('Ошибка загрузки заказа');
      }
    });
  }

  editOrder(): void {
    if (this.order) {
      this.router.navigate(['edit-order', this.order.OrderId]);
    }
  }
}
