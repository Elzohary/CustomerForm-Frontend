import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomer } from '../Models/i-customer';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'https://localhost:44349/api';

  constructor(private http : HttpClient) { 
  }

  getAllCustomers(): Observable<ICustomer[]>{
    return this.http.get<ICustomer[]>(`${this.baseUrl}/customers`);
  }
  

  addCustomer(customer : ICustomer) : Observable<ICustomer> {
    customer.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<ICustomer>(`${this.baseUrl}/customers`, customer);
  }


  update(customer : ICustomer) : Observable<ICustomer> {
    return this.http.put<ICustomer>(`${this.baseUrl}/customers/${customer.id}`, customer);
  }


  deleteCustomer(id: string) : Observable<any>{
    return this.http.delete(`${this.baseUrl}/customers/${id}`);
  }
}
