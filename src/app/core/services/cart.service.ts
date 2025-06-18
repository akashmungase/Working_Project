import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private itemCount = new BehaviorSubject<number>(0);
  
  cartItems$ = this.cartItems.asObservable();
  itemCount$ = this.itemCount.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  private updateItemCount(items: CartItem[]) {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    this.itemCount.next(count);
  }

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = [...this.cartItems.value];
    const existingItemIndex = currentItems.findIndex(
      item => item.product.id === product.id
    );

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.updateCartState(currentItems);
  }

  removeFromCart(index: number) {
    const currentItems = [...this.cartItems.value];
    currentItems.splice(index, 1);
    this.updateCartState(currentItems);
  }

  updateQuantity(index: number, newQuantity: number) {
    const currentItems = [...this.cartItems.value];
    
    if (newQuantity > 0) {
      currentItems[index].quantity = newQuantity;
      this.updateCartState(currentItems);
    } else {
      this.removeFromCart(index);
    }
  }

  clearCart() {
    this.cartItems.next([]);
    this.itemCount.next(0);
    localStorage.removeItem('cart');
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
  }

  private updateCartState(items: CartItem[]) {
    this.cartItems.next(items);
    this.updateItemCount(items);
    this.saveCartToStorage();
  }

    private loadCartFromStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        const items: CartItem[] = JSON.parse(cartData);
        const validatedItems = items.map(item => ({
          ...item,
          product: this.validateProduct(item.product)
        }));
        this.cartItems.next(validatedItems);
        this.updateItemCount(validatedItems);
      } catch (e) {
        console.error('Error parsing cart data', e);
        this.clearCart();
      }
    }
  }

  private validateProduct(product: any): Product {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      images: product.images,
      category: product.category,
      slug: product.slug
    };
  }
}