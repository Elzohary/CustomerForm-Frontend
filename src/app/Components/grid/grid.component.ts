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
          this.gridData = customers;
          this.sortedData = this.gridData;
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

      switch (sort.active) {
        case 'id':{
          this.setAZ(sort);
          return compare(a.id, b.id, isAsc);
        }

        case 'name': {
          this.setAZ(sort);
          return compare(a.name, b.name, isAsc);
        }
          
        case 'class': {
          this.setAZ(sort);
          return compare(a.class, b.class, isAsc);
        }
          
        case 'phone': {
          this.setAZ(sort);
          return compare(a.phone, b.phone, isAsc);
        }
          
        case 'email': {
          this.setAZ(sort);
          return compare(a.email, b.email, isAsc);
        }
          
        case 'comment': {
          this.setAZ(sort);
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

function compare(
  a: number | string, 
  b: number | string,
  isAsc: boolean
  ) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
};

