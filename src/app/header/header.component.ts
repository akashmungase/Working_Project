import { Component } from '@angular/core';
import { CartService } from '../core/services/cart.service';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  currentUser = false;
  cartItemCount = 0;
  userData: any;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      let user_data = localStorage.getItem('user_data');
      if (user_data) {
        this.userData = JSON.parse(user_data);
      }

      this.cartService.itemCount$.subscribe(count => {
        this.cartItemCount = count;
      });
    });
  }

  logoutUser() {
    this.authService.logout();
    this.router.navigate(['']);
    this.cartItemCount = 0
  }
}
