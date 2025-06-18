// cart.service.ts
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
  private itemCount = new BehaviorSubject<number>(0);
  
  cartItems$ = this.cartItems.asObservable();
  itemCount$ = this.itemCount.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  // private loadCartFromStorage(): void {
  //   const cartData = localStorage.getItem('cart');
  //   if (cartData) {
  //     try {
  //       const items = JSON.parse(cartData);
  //       this.cartItems.next(items);
  //       this.updateItemCount(items);
  //     } catch (e) {
  //       console.error('Error parsing cart data', e);
  //       this.clearCart();
  //     }
  //   }
  // }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  private updateItemCount(items: CartItem[]): void {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    this.itemCount.next(count);
  }

  addToCart(product: Product, quantity: number = 1): void {
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

  removeFromCart(index: number): void {
    const currentItems = [...this.cartItems.value];
    currentItems.splice(index, 1);
    this.updateCartState(currentItems);
  }

  updateQuantity(index: number, newQuantity: number): void {
    const currentItems = [...this.cartItems.value];
    
    if (newQuantity > 0) {
      currentItems[index].quantity = newQuantity;
      this.updateCartState(currentItems);
    } else {
      this.removeFromCart(index);
    }
  }

  clearCart(): void {
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

  private updateCartState(items: CartItem[]): void {
    this.cartItems.next(items);
    this.updateItemCount(items);
    this.saveCartToStorage();
  }

    private loadCartFromStorage(): void {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        const items: CartItem[] = JSON.parse(cartData);
        // Ensure all items have proper Product objects
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

  // Ensure product has required fields
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