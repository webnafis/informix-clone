import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {FilterData} from '../../interfaces/core/filter-data';
import {Brand} from '../../interfaces/common/brand.interface';
const API_URL = environment.apiBaseLink + '/api/brand/';


@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getAllBrands()
   */


  getAllBrands(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Brand[], count: number, success: boolean }>(API_URL + 'get-all-by-shop', filterData, {params});
  }
}
