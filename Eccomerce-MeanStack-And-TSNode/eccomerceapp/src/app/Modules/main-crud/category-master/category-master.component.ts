import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/Services/category.service';

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.css']
})
export class CategoryMasterComponent implements OnInit {

  AlldataSubscribe!:Subscription;
  PostDataSubscribe!:Subscription;
  PutDataSubscribe!:Subscription;
  deleteDataSubscribe!:Subscription;
  FormsData!:FormGroup;
  modalRefrence:any;

  AllData:any;
  EditData:boolean = false;
  editId:any;
  totalPages:any;
  currentPage = 1;
  headers: string[] = [];
  
  constructor(
    private fb:FormBuilder,
    private apiData:CategoryService
    ){}

  ngOnInit(): void {

    this.FormsData = this.fb.group({
      id: ['',Validators.required],
      name: ['', Validators.required]
    });


    this.getCategoryApiData()
    console.log(this.headers)

  }

  ngOnDestroy() {
    if (this.AlldataSubscribe) {
      this.AlldataSubscribe.unsubscribe(); 
    }
    if(this.PostDataSubscribe){
      this.PostDataSubscribe.unsubscribe();
    }
    if(this.PutDataSubscribe){
      this.PutDataSubscribe.unsubscribe();
    }
    if(this.deleteDataSubscribe){
      this.deleteDataSubscribe.unsubscribe();
    }
  }

  open(): void {
   this.EditData = false;
   this.FormsData.reset();
  //  this.modalRefrence =  this.modalService.open(this.modalContent);
  }

  openEdit(data:any): void {
    // this.modalRefrence = this.modalService.open(this.modalContent)
    this.EditData = true;
    if(this.EditData){
      this.FormsData.patchValue({
        name: data.name
      });
      this.editId = data.id
    }
  }


  openDelete(data:any){
    this.apiData.deleteCategory(data.id).subscribe(data=>{
      console.log(data)
      this.getCategoryApiData()
    });
  }
  

  saveChanges(): void {
    console.log(this.FormsData.value);
    const data = this.FormsData.value
    this.PostDataSubscribe = this.apiData.createCategory(data).subscribe(data=>{
      console.log(data);
      this.getCategoryApiData()
    });
    
    // this.modalRefrence.close()
    this.FormsData.reset();
  }

  editChanges(): void {
    const formValue = this.FormsData.value
    this.PutDataSubscribe = this.apiData.updateCategory(this.editId,formValue).subscribe(data=>{
      console.log(data);
      this.getCategoryApiData()
    });
    this.FormsData.reset()
    this.EditData = false;
    this.editId = null;

  }


   getCategoryApiData(){
    this.AlldataSubscribe =  this.apiData.getCategorys().subscribe(data=>{
      console.log(data)
      this.AllData = data;
      this.headers = Object.keys(this.AllData[0])
    });
  }




}
