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

interface User {
  id: number;
  login: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders`);
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/${id}`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  getOrderItems(orderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders/${orderId}/items`);
  }

  login(credentials: { login: string; password: string }) {
    return this.http.post<any>('http://localhost:3000/api/login', credentials);
  }

  createOrder(order: any) {
    return this.http.post(`${this.baseUrl}/orders`, order);
  }

  updateOrder(id: number, order: any) {
    return this.http.put(`${this.baseUrl}/orders/${id}`, order);
  }

}
