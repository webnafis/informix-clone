import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'currencyCtr'
})
export class CurrencyCtrPipe implements PipeTransform {



  transform(value: number, key?: 'code' | 'symbol' | 'name'): string {
    if (typeof value !== 'number') {
      return '';
    }

    // Fetch currency from AppConfigService
    const currency = null;

    // Default key is 'symbol' if no key is provided
    const defaultKey: 'code' | 'symbol' | 'name' = key || 'symbol';

    // Define default currency object
    const defaultCurrency = {
      code: 'BDT',
      name: 'Bangladesh',
      symbol: '৳'
    };

    // Use fetched currency or fallback to default currency
    const currencyData = currency && Object.keys(currency).length ? currency : defaultCurrency;

    // Format the number with the currency symbol
    return `${currencyData[defaultKey] || defaultCurrency[defaultKey]} ${value}`;
  }
}
