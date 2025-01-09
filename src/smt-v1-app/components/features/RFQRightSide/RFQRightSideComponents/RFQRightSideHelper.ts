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
    case 'CNY':
      symbol = '¥';
      break;
    case 'JPY':
      symbol = '¥';
      break;
    case 'CAD':
      symbol = 'C$';
      break;
    case 'AUD':
      symbol = 'A$';
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
  }
  return symbol;
};
