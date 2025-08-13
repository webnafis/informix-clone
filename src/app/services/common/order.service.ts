import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FilterData } from '../../interfaces/core/filter-data';
import { Order } from '../../interfaces/common/order.interface';
import {ResponsePayload} from "../../interfaces/core/response-payload.interface";

const API_URL = environment.apiBaseLink + '/api/order/';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  // Inject
  private readonly httpClient = inject(HttpClient);

  /**
   * getAllOrder()
   * addOrder()
   * getOrderByIds()
   * generateInvoiceById()
   * updateOrderById()
   */

  getAllOrder(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Order[];
      count: number;
      success: boolean;
    }>(API_URL + 'get-all-by-user', filterData, { params });
  }

  addOrder(data: Order, isUserAuth: boolean) {
    console.log('addOrder', data);
    return this.httpClient.post<ResponsePayload>
    (API_URL + (isUserAuth ? 'add-order-by-user' : 'add-order-by-anonymous'), data);
  }

  addIncompleteOrder(data: Order, isUserAuth: boolean) {
    console.log('addIncompleteOrder', data);
    return this.httpClient.post<ResponsePayload>
    (API_URL + ( isUserAuth ? 'add-incomplete-order-by-user' : 'add-incomplete-order-by-anonymous'), data);
  }

  getOrderByIds(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Order;
      success: boolean;
      message: string;
    }>(API_URL + 'get-by-id/' + id, { params });
  }

  getOrderByOrderId(orderId: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Order;
      success: boolean;
      message: string;
    }>(API_URL + 'get-order-by-order-id/' + orderId, { params });
  }

  generateInvoiceById(id: string) {
    return this.httpClient.get<{ data: any, message: string, success: boolean }>(API_URL + 'generate-invoice-user/' + id);
  }

  updateOrderById(id: string, data: Order) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update-by-user/' + id, data);
  }

  updateIncompleteOrderById(id: string, data: Order) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update-incomplete-order-by-id/' + id, data);
  }

  getUserDataByPhoneNo(data: Order) {
    return this.httpClient.post<ResponsePayload>(API_URL + 'get-users-data-by-phone-no', data);
  }
}
