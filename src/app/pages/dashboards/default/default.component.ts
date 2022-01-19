import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { apiService } from './../api.service'

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  itemprice: boolean = false;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ["sno", "imageTitle", "category", "image", "itemforSale", "actions"];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  reactiveform: FormGroup;
  empsubmitted: boolean = false;
  imageSrc: any;
  file: any;
  constructor(private modalService: NgbModal, private fb: FormBuilder, private projectService: apiService) { }

  ngOnInit(): void {
    this.tablelist()
    this.formgrp()
  }
  formgrp() {
    this.reactiveform = this.fb.group({
      _id: [null],
      imageTitle: ['', [Validators.required]],
      imageDiscription: ['', [Validators.required]],
      image: [null],
      category: [null, [Validators.required]],
      itemforSale: ['', [Validators.required]],
      accept: ['', [Validators.required]],
      itemPrice: ['']
    })
  }

  get ef() { return this.reactiveform.controls; }

  tablelist() {
    this.projectService.list().subscribe(
      (res: any) => {
        console.log('res: ', res);
        this.dataSource = new MatTableDataSource(res.list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => {
        console.log(err);

      }
    );
    (err) => {
      console.log(err);
    };
  }
  editemployee(content, row: any) {
    this.employeepopup(content);
    console.log("Edit Value -->", row);
    this.reactiveform.patchValue({
      _id: row._id,
      imageTitle: row.imageTitle,
      imageDiscription: row.imageDiscription,
      //image: row.image,
      category: row.category,
      itemforSale: row.itemforSale,
      accept: row.accept,
      itemPrice: row.itemPrice,
    })
    this.itemprice = (row.itemforSale == 'true' ? true : false)
    this.imageSrc = 'http://localhost:3000/images/' + row.image;
  }
  onSubmit() {
    this.empsubmitted = true;
    if (this.reactiveform.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append("image", this.file, this.file.name);
    formData.append("_id", this.reactiveform.value._id);
    formData.append("imageTitle", this.reactiveform.value.imageTitle);
    formData.append("imageDiscription", this.reactiveform.value.imageDiscription);
    formData.append("category", this.reactiveform.value.category);
    formData.append("itemforSale", this.reactiveform.value.itemforSale);
    formData.append("accept", this.reactiveform.value.accept);
    formData.append("itemPrice", this.reactiveform.value.itemPrice);
    this.projectService.add(formData).subscribe((res) => {
      if (res.status == true) {
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: res.message, icon: 'success' })
        this.modalService.dismissAll('Close click');
        this.tablelist();
        this.employeeformreset();
      }
      else {
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: res.message, icon: 'error' })

      }
    })

  }
  // emp popup open
  employeepopup(content: any) {
    this.empsubmitted = false;
    // this.empidgen();
    // this.employeeformreset();
    this.modalService.open(content, { size: 'md', windowClass: 'modal-holder', centered: true, backdrop: "static" }).result.then((result) => {
      console.log("Modal closed" + result);
    }).catch((res) => {
      // this.toastr.error(res)
    });
  }
  employeeformreset() {
    this.empsubmitted = false;
    this.reactiveform.reset();
    this.imageSrc = '';
    this.itemprice = false;
    this.file = null;
  }

  deleteemployee(id: any) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'DO You Want to Delete This file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.value) {
        var senddata = {
          "_id": id
        }
        this.projectService.delete(senddata).subscribe(data => {
          if (data.status == true) {
            this.tablelist();
            Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: data.message, icon: 'success' })
          }
          else {
            // alert(data.message)
            Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: data.message, icon: 'error' })
          }
        })

      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  handleChange(evt) {
    var target = evt.target;
    if (target.value == "true") {
      this.itemprice = true;

    } else {
      this.itemprice = false;
      this.reactiveform.patchValue({
        itemPrice: ''
      })
    }
  }
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(this.file);
    }
  }

}
