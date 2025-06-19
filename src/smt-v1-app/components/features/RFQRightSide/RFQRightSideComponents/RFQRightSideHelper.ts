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

export interface SaveRFQ {
  rfqMailId: string;
  rfqPartRequests: RFQPartRequest[];
  alternativeRFQPartRequests: AlternativeRFQPartRequest[];
  clientId: string;
  rfqDeadline: string;
  clientRFQId: string;
  clientNote?: string;
}
export interface RFQPartRequest {
  rfqPartId: string;
  partNumber: string;
  partName: string;
  partDescription: string;
  reqQTY: number;
  fndQTY: number;
  reqRFQPartCondition:
    | 'NE'
    | 'FN'
    | 'NS'
    | 'OH'
    | 'SV'
    | 'AR'
    | 'RP'
    | 'IN'
    | 'TST'
    | '';
  fndRFQPartCondition:
    | 'NE'
    | 'FN'
    | 'NS'
    | 'OH'
    | 'SV'
    | 'AR'
    | 'RP'
    | 'IN'
    | 'TST'
    | '';
  supplierLT: number;
  clientLT: number;
  supplierId: string;
  price: number;
  currency: string;
  comment: string;
  isDgPackagingCost: boolean;
  tagDate: string;
  certificateType:
    | 'CERTIFICATE_1'
    | 'CERTIFICATE_2'
    | 'CERTIFICATE_3'
    | 'CERTIFICATE_4';
  MSN: string;
  warehouse: string;
  stock: number;
  stockLocation: string;
  airlineCompany: string;
  MSDS: string;
}

export interface AlternativeRFQPartRequest extends RFQPartRequest {
  parentPartNumber: string;
}
