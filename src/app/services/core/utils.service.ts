import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {



  removeUrlQuery(url: string): string {
    if (url) {
      return url.replace(/\?.*/, '');
    }
    return '';
  }


}
