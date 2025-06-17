import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        this.cartItems.next(JSON.parse(cartData));
      } catch (e) {
        console.error('Error parsing cart data', e);
        localStorage.removeItem('cart');
      }
    }
  }

  private saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = this.cartItems.value;
    const existingItemIndex = currentItems.findIndex(item => 
      item.product.id === product.id
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      currentItems.push({ product, quantity });
    }

    this.cartItems.next(currentItems);
    this.saveCartToStorage();
  }

  removeFromCart(index: number) {
    const currentItems = this.cartItems.value;
    currentItems.splice(index, 1);
    this.cartItems.next(currentItems);
    this.saveCartToStorage();
  }

  updateQuantity(index: number, newQuantity: number) {
    const currentItems = this.cartItems.value;
    if (newQuantity > 0) {
      currentItems[index].quantity = newQuantity;
    } else {
      currentItems.splice(index, 1);
    }
    this.cartItems.next(currentItems);
    this.saveCartToStorage();
  }

  clearCart() {
    this.cartItems.next([]);
    localStorage.removeItem('cart');
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }
}