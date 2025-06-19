import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  totalPrice = 0;
  loading = true;
  userData: any;
  subscription!: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
      setTimeout(() => {
        this.loading = false;
      }, 200);
    });
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  increaseQuantity(index: number) {
    const newQuantity = this.cartItems[index].quantity + 1;
    this.cartService.updateQuantity(index, newQuantity);
  }

  decreaseQuantity(index: number) {
    const currentQuantity = this.cartItems[index].quantity;
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(index, currentQuantity - 1);
    } else {
      this.removeItem(index);
    }
  }

  removeItem(index: number) {
    this.cartService.removeFromCart(index);
  }

  continueShopping() {
    this.router.navigate(['']);
  }

  proccedToCheckout() {
    this.userData = localStorage.getItem('user_data');
    let user = JSON.parse(this.userData)
    if (!user) {
      this.router.navigate(['/auth/login'])
    } else {
      this.router.navigate(['/payment']);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}