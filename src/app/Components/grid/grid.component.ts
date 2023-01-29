import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ICustomer } from 'src/app/Models/i-customer';
import { CustomerService } from 'src/app/Services/customer.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent implements OnInit, OnChanges {
  gridData: ICustomer[] = [];
  @Output() selectedItemEvent: EventEmitter<ICustomer>;
  @Input() dataChanged : ICustomer[] = [];
  sortedData!: ICustomer[] ;
  selectedColoumn: string = '';
  activeColoumn: string = '';
  rowClicked : number = 0;
  @Input() RrowClicked: number = 0;

  data : ICustomer[] = [this.emptyCustomer, this.emptyCustomer, this.emptyCustomer, this.emptyCustomer, this.emptyCustomer];


  constructor(private customerService: CustomerService) {
    this.selectedItemEvent = new EventEmitter<ICustomer>();
  }
  
  ngOnChanges(): void {
    this.gridData = this.dataChanged;
    this.sortedData = this.dataChanged;
    this.rowClicked = this.RrowClicked;
  }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.gridData = customers;
        this.sortedData = this.gridData;
        
        if(customers.length < 5) {
          for(let i = 0 ; i = 5 - customers.length ; i++) {
            this.sortedData.push(this.emptyCustomer);
          }
        }
        return this.sortedData;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  selectRow(item: ICustomer) {
    if(item.id != '' ){
      this.selectedItemEvent.emit(item);
    }
  }

  sortData(sort: Sort) {
    const data = this.gridData.slice();

    if (!sort.active || sort.direction === '') {
      this.gridData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      console.log(sort);
      switch (sort.active) {
        case 'id':{
          this.setAZ(sort);
          if(a.id === '') return 1;
          if(b.id === '') return -1;
          return compare(a.id, b.id, isAsc);
        }

        case 'name': {
          this.setAZ(sort);
          if(a.name === '') return 1;
          if(b.name === '') return -1;
          return compare(a.name, b.name, isAsc);
        }
          
        case 'class': {
          this.setAZ(sort);
          if(a.class === '') return 1;
          if(b.class === '') return -1;
          return compare(a.class, b.class, isAsc);
        }
          
        case 'phone': {
          this.setAZ(sort);
          if(a.phone === '') return 1;
          if(b.phone === '') return -1;
          return compare(a.phone, b.phone, isAsc);
        }
          
        case 'email': {
          this.setAZ(sort);
          if(a.email === '') return 1;
          if(b.email === '') return -1;
          return compare(a.email, b.email, isAsc);
        }
          
        case 'comment': {
          this.setAZ(sort);
          if(a.comment === '') return 1;
          if(b.comment === '') return -1;
          return compare(a.comment, b.comment, isAsc);
        }
          
        default:
          return 0;
      }
    });
  }
  

  setAZ(sort : Sort) {
    this.activeColoumn = sort.active;
    this.selectedColoumn = sort.direction == 'asc' ? '(A-Z)' : '(Z-A)';
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

function compare(a: string, b: string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

