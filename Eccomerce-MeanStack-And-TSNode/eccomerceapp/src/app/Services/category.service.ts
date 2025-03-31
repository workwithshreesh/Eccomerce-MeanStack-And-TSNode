import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  Base_URL = environment.category;
  
    constructor(private http: HttpClient) { }
  
    // GET all Categorys
    getCategorys(): Observable<any> {
      return this.http.get<any>(this.Base_URL);
    }
  
    // GET Category by ID
    getCategoryById(id: string): Observable<any> {
      return this.http.get<any>(`${this.Base_URL}/${id}`);
    }
  
    // POST create a new Category
    createCategory(Category: any): Observable<any> {
      return this.http.post<any>(this.Base_URL, Category);
    }
  
    // PUT update an existing Category
    updateCategory(id: string, Category: any): Observable<any> {
      return this.http.put<any>(`${this.Base_URL}/${id}`, Category);
    }
  
    // DELETE a Category
    deleteCategory(id: string): Observable<any> {
      return this.http.delete<any>(`${this.Base_URL}/${id}`);
    }
}
