export const getPriceCurrencySymbol = (unitPriceCurrency: string): string => {
  let symbol = '';

  switch (unitPriceCurrency) {
    case 'USD':
      symbol = '$';
      break;
    case 'EUR':
      symbol = '€';
      break;
    case 'RUB':
      symbol = '₽';
      break;
    case 'TRY':
      symbol = '₺';
      break;
    case 'GBP':
      symbol = '£';
      break;
    case 'JPY':
    case 'CNY':
      symbol = '¥';
      break;
    case 'CAD':
    case 'AUD':
    case 'MXN':
    case 'NZD':
      symbol = '$';
      break;
    case 'CHF':
      symbol = 'CHF';
      break;
    case 'SGD':
      symbol = 'S$';
      break;
    case 'HKD':
      symbol = 'HK$';
      break;
    case 'INR':
      symbol = '₹';
      break;
    case 'BRL':
      symbol = 'R$';
      break;
    case 'KRW':
      symbol = '₩';
      break;
    case 'SEK':
    case 'NOK':
    case 'DKK':
      symbol = 'kr';
      break;
    case 'ZAR':
      symbol = 'R';
      break;
    case 'AED':
      symbol = 'د.إ';
      break;
    case 'SAR':
      symbol = '﷼';
      break;
    case 'MYR':
      symbol = 'RM';
      break;
    case 'THB':
      symbol = '฿';
      break;
    case 'IDR':
      symbol = 'Rp';
      break;
    case 'PLN':
      symbol = 'zł';
      break;
    case 'CZK':
      symbol = 'Kč';
      break;
    case 'HUF':
      symbol = 'Ft';
      break;
    case 'ILS':
      symbol = '₪';
      break;
    default:
      console.warn(`Currency not found: ${unitPriceCurrency}`);
      symbol = '?'; // Default symbol for unsupported currencies
  }

  return symbol;
};
