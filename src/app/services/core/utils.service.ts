import { Injectable } from '@angular/core';
import moment from 'moment';
import sha256 from 'crypto-js/sha256';
import { PixelUserData } from '../../interfaces/core/analytics.interface';


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
