import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Ingredient} from "./new-recipe/new-recipe.component";

export interface IRecipe {
  name: string;
  ingredients: Ingredient[];
  description: string;
  picture: string | ArrayBuffer | null | undefined;
  savedDate?: Date;
}


export interface Order {
  OrderId: number;
  FullName: string;
  Phone: string;
  Email: string;
  OrderDate: string;
  DueDate: string;
  Status: string;
  Items: any[];
  Comment?: string;
}

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getOrderById(id: number) {
    console.log('HTTP GET /orders/' + id);
    return this.http.get<any>(`${this.baseUrl}/orders/${id}`);
  }


  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  getOrderItems(orderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders/${orderId}/items`);
  }

  login(credentials: { login: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }

  createOrder(order: any) {
    return this.http.post(`${this.baseUrl}/orders`, order);
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/orders/${orderId}`);
  }

  updateOrder(id: number, order: any) {
    return this.http.put(`${this.baseUrl}/orders/${id}`, order);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`);
  }

  getOrderDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/${id}/details`);
  }

}
