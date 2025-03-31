import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/Services/cart.service';
import { CategoryService } from 'src/app/Services/category.service';
import { ProductService } from 'src/app/Services/product.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.css']
})
export class ProductMasterComponent implements OnInit, OnDestroy {

  addProductDataSubscribe!: Subscription;
  editProductDataSubscribe!: Subscription;
  deleteProductDataSubscribe!: Subscription;
  retriveProductDataSubscribe!: Subscription;
  retriveCategoryDataSubscribe!:Subscription

  allProductData: any = [];
  formData!: FormGroup;
  productEditId: any;
  isEdit: boolean = false;
  selectedFiles: { file: File; previewUrl: string }[] = [];
  allCategoryData:any
  Base_url: string = environment.baseUrl;

  @ViewChild('productModal', { static: false }) productModal!: ElementRef;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.getAllData();
    this.getAllCategoryData();
    this.initializeForm();
  }

 
  initializeForm() {
    this.formData = this.fb.group({
      id: [''],
      name: ["", [Validators.required, Validators.minLength(3)]],
      price: ["", [Validators.required]],
      sku: ["", [Validators.required]],
      category: ["", [Validators.required]],
      images: [[],[]] 
    });
  }

  
  getAllData() {
    this.addProductDataSubscribe = this.productService.getProducts().subscribe(data => {
      this.allProductData = data;
    });
  }



  getAllCategoryData(){
    this.categoryService.getCategorys().subscribe(data=>{
      this.allCategoryData = data;
      console.log(this.allCategoryData);
    });
  }

  
  onFileSelect(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      Array.from(fileInput.files).forEach((file: File) => {
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          this.selectedFiles.push({
            file: file,
            previewUrl: e.target.result
          });
        };

        console.log(this.selectedFiles[0])
        reader.readAsDataURL(file);
      });
    }
  }
  
  
    

  
  oneditClick(productdata: any) {
    this.isEdit = true;
    this.productEditId = productdata.id;
  
    this.retriveProductDataSubscribe = this.productService.getProductById(productdata.id).subscribe(data => {
      if (data) {
        this.formData.patchValue({
          name: data.name || '',
          price: data.price || '',
          sku: data.sku || '',
          category: data.category?.id || '',
        });
  
        // Ensure category is selected automatically
        setTimeout(() => {
          this.formData.patchValue({ category: data.category?.id });
        }, 0);
  
        this.selectedFiles = data.images.map((image: any) => ({
          file: null, 
          previewUrl: this.Base_url+image.url  
        }));
      }
    });
  }
  

  

  deleteProduct(productdata: any) {
    this.deleteProductDataSubscribe = this.productService.deleteProduct(productdata.id).subscribe(() => {
      this.allProductData = this.allProductData.filter((p: any) => p.id !== productdata.id);  
      this.getAllData()
    });
    
  }

  
  saveProduct(): void {
    const formDataToSend = new FormData();
    formDataToSend.append('name', this.formData.get('name')?.value);
    formDataToSend.append('price', this.formData.get('price')?.value);
    formDataToSend.append('sku', this.formData.get('sku')?.value);
    formDataToSend.append('categoryId', this.formData.get('category')?.value);

    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(fileObj => {
        formDataToSend.append('images', fileObj.file, fileObj.file.name);
      });
    }

    this.productService.createProduct(formDataToSend).subscribe(
      (data) => {
        this.allProductData.push(data); // Update UI
        this.selectedFiles = []
        this.formData.reset();
        this.getAllData()
      },
      (error) => {
        console.error('Error saving product:', error);
      }
    );
    
  }

  
  editProduct() {
    const productdata = new FormData();
    productdata.append('name', this.formData.get('name')?.value);
    productdata.append('price', this.formData.get('price')?.value);
    productdata.append('sku', this.formData.get('sku')?.value);
    productdata.append('category', this.formData.get('category')?.value);

    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(fileObj => {
        if(fileObj.file){
          productdata.append('images', fileObj.file, fileObj.file.name);
        }
      });
      
    }

    this.editProductDataSubscribe = this.productService
      .updateProduct(this.productEditId, productdata)
      .subscribe(
        (updatedProduct) => {
          this.allProductData = this.allProductData.map((product: any) =>
            product.id === this.productEditId ? updatedProduct : product
          );
          this.formData.reset();
          this.getAllData()
          this.selectedFiles = []
        },
        (error) => {
          console.error('Error updating product:', error);
        }
      );
      this.getAllData()
  }

  
  addNew() {
    this.selectedFiles = []
    this.isEdit = false;
    this.formData.reset();
  }

  validateAndEdit(): void {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }
    this.editProduct();
    this.getAllData()
  }
  

  
  ngOnDestroy(): void {
    if (this.addProductDataSubscribe) this.addProductDataSubscribe.unsubscribe();
    if (this.editProductDataSubscribe) this.editProductDataSubscribe.unsubscribe();
    if (this.deleteProductDataSubscribe) this.deleteProductDataSubscribe.unsubscribe();
    if (this.retriveProductDataSubscribe) this.retriveProductDataSubscribe.unsubscribe();
    if (this.retriveCategoryDataSubscribe) this.retriveCategoryDataSubscribe.unsubscribe();
  }
}
