import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ICustomer } from 'src/app/Models/i-customer';
import { CustomerService } from 'src/app/Services/customer.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { GridComponent } from '../grid/grid.component';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {


  customerBinding! : ICustomer ;
  selectedCustomer! : ICustomer ;
  gridData : ICustomer[] = [];
  isSaveBtnClickable : boolean = true;
  isUpdateBtnClickable : boolean = false;
  isDeleteBtnClickable : boolean = false;
  @ViewChild('child') gridChild! : GridComponent ;

  constructor(private customerService : CustomerService, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.customerBinding = this.emptyCustomer;
    this.selectedCustomer = this.emptyCustomer;
  }

  getAllCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.gridData = customers;
        if (customers.length < 5) {
          for(let i = 0 ; i = 5- customers.length ; i++) {
            this.gridData.push(this.emptyCustomer);
          }
        }
        
      }});
  }

  save() {
    this.customerService.addCustomer(this.customerBinding).subscribe({
      next: (customer) => {
        this._snackBar.open(`${this.customerBinding} is Added!`, 'Ok', {duration: 2000});
        this.clear();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  clear() {
    this.selectedCustomer = this.emptyCustomer;
    this.customerBinding = this.emptyCustomer;

    this.isSaveBtnClickable = true;
    this.isUpdateBtnClickable = false;
    this.isDeleteBtnClickable = false;
  }

  update() {
    this.customerService.update(this.customerBinding).subscribe({
      next: (customer) => {
        this.getAllCustomers();
        this._snackBar.open(`${this.customerBinding.name} is Updated!`, 'Ok', {duration: 2000});
        this.clear();
        this.isUpdateBtnClickable = false;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  delete() {
    this.customerService.deleteCustomer(this.selectedCustomer.id).subscribe({
      next: (customer) => {
        this._snackBar.open(`${this.selectedCustomer.name} is deleted!`, 'Ok', {duration: 2000});
        this.clear();
        this.getAllCustomers();
      }
    });
    
  }

  onRowSelected(selectedCustomer : ICustomer) {
    this.selectedCustomer = selectedCustomer;
    this.customerBinding = selectedCustomer;

    this.isSaveBtnClickable = false;
    this.isUpdateBtnClickable = true;
    this.isDeleteBtnClickable = true;
  }

  get emptyCustomer() : ICustomer {
    return {
      id: '',
      name: '',
      email: '',
      class: '',
      phone: '',
      comment: ''
    };
  }
}
