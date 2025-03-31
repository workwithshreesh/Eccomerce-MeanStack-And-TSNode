import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  Base_URL = environment.product;

  constructor(private http: HttpClient) { }

  // GET all products
  getProducts(): Observable<any> {
    return this.http.get<any>(this.Base_URL);
  }

  // GET product by ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.Base_URL}/${id}`);
  }

  // POST create a new product
  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.Base_URL, product);
  }

  // PUT update an existing product
  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put<any>(`${this.Base_URL}/${id}`, product);
  }

  // DELETE a product
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.Base_URL}/${id}`);
  }
}
