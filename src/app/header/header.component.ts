import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../core/services/cart.service';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser = false;
  cartItemCount = 0;
  userData: any;
  subscription!: Subscription;
  cartSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      let user_data = localStorage.getItem('user_data');
      if (user_data) {
        this.userData = JSON.parse(user_data);
      }

      this.cartSubscription = this.cartService.itemCount$.subscribe(count => {
        this.cartItemCount = count;
      });
    });
  }

  logoutUser() {
    this.authService.logout();
    this.router.navigate(['']);
    this.cartItemCount = 0
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }
}
