import { Component } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'e-commerce';
  isLoggedIn = false;
  cartItemCount = 0;

  constructor(private cartService: CartService) {
    this.cartService.itemCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

}
