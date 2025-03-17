export const tableHeaders = [
  'Part Number*',
  'Part Name*',
  'Req. QTY*',
  'Fnd. QTY',
  'Req. CND*',
  'Fnd. CND',
  'Suppl. LT',
  'Client LT',
  'Unit Price',
  'Supplier',
  'Total',
  'Comments',
  'DGPackagingCost',
  'Tag Date',
  'Last Updat. Date',
  'Cert. Type',
  'MSN',
  'Warehouse',
  'Stock',
  'Stock Loc.',
  'Airline Com.',
  'MSDS'
];
export type Supplier = {
  supplierId: string;
  supplierName: string;
};

// Function to convert date to "DD.MM.YYYY" format
export const formatDate = dateString => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export interface Currency {
  id: string;
  currency: string;
  currencySymbol: string;
}

export function convertDateFormat(inputDate: string): string {
  // Split the input date by the dot separator
  if (!inputDate) {
    return '';
  }
  const [day, month, year] = inputDate.split('.');

  // Return the date in the desired format
  return `${year}-${month}-${day}`;
}

export let tempIdCount = 1;
export function generateTempRFQPartId(): string {
  const id = `temp-${String(tempIdCount).padStart(2, '0')}`;
  tempIdCount++;
  return id;
}
