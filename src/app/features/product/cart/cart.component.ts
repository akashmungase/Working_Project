import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load cart items from service (which loads from localStorage)
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
  }

  increaseQuantity(index: number): void {
    const newQuantity = this.cartItems[index].quantity + 1;
    this.cartService.updateQuantity(index, newQuantity);
  }

  decreaseQuantity(index: number): void {
    const currentQuantity = this.cartItems[index].quantity;
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(index, currentQuantity - 1);
    } else {
      this.removeItem(index);
    }
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}