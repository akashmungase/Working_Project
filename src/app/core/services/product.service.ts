import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/products';

  constructor(private http: HttpClient) { }

  getProducts(offset: number, limit: number, title?: string, categoryId?: number, priceMin?: number, priceMax?: number) {
    let url = `${this.apiUrl}?offset=${offset}&limit=${limit}`;

    if (title) url += `&title=${title}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (priceMin) url += `&price_min=${priceMin}`;
    if (priceMax) url += `&price_max=${priceMax}`;

    return this.http.get<any[]>(url);
  }

  getCategories() {
    return this.http.get<any[]>('https://api.escuelajs.co/api/v1/categories');
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }
}
