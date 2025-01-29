export type SupplierStatus = {
  label: 'CONTACTED' | 'NOTCONTACTED' | 'BLACK LIST';
  type: 'success' | 'warning' | 'danger';
};

export interface SupplierData {
  id: string;
  supplierCompany: string;
  segments: string;
  brand: string;
  countryInfo: string;
  pickupaddress: string;
  email: string;
  status: SupplierStatus;
  quoteID: string | null;
  attachedID: string | null;
  attachedName: string | null;
  workingDetails: string | null;
  userName: string;
  certificates: string[];
  dialogSpeed: string;
  dialogQuality: string;
  easeOfSupply: string;
  supplyCapability: string;
  euDemandOfParts: string;
  createdBy: string;
  createdOn: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
}

export const mockData: SupplierData[] = [
  {
    id: '0',
    supplierCompany: 'Avionics Interface Technologies',
    segments: 'GENERAL',
    brand: 'VIKING',
    countryInfo: 'ANY',
    pickupaddress: 'Izmir/Urla',
    email: 'hasan@gmail.com',
    status: {
      label: 'CONTACTED',
      type: 'success',
    },
    quoteID: null,
    attachedID: null,
    attachedName: null,
    workingDetails: null,
    userName: 'hasan',
    certificates: ["CERTIFICATE_1"],
    dialogSpeed: '0',
    dialogQuality: '0',
    easeOfSupply: '0',
    supplyCapability: '0',
    euDemandOfParts: '0',
    createdBy: 'Hasan Baydoğan',
    createdOn: '28.01.2025',
    lastModifiedBy: 'Hasan',
    lastModifiedOn: '28.01.2025',
  },
  {
    id: '1',
    supplierCompany: 'Frey, Lloyd and Pena',
    segments: 'HEALTH',
    brand: 'CENTER',
    countryInfo: 'ANY',
    pickupaddress: 'Sharonborough/WA',
    email: 'greenamy@yahoo.com',
    status: {
      label: 'NOTCONTACTED',
      type: 'warning',
    },
    quoteID: null,
    attachedID: null,
    attachedName: null,
    workingDetails: null,
    userName: 'greenamy',
    certificates: ["CERTIFICATE_2"],
    dialogSpeed: '0',
    dialogQuality: '0',
    easeOfSupply: '0',
    supplyCapability: '0',
    euDemandOfParts: '0',
    createdBy: 'system',
    createdOn: 'system',
    lastModifiedBy: 'system',
    lastModifiedOn: 'system',
  },
  {
    id: '2',
    supplierCompany: 'Adams, Mullins and Ruiz',
    segments: 'RETAIL',
    brand: 'ALWAYS',
    countryInfo: 'Germany',
    pickupaddress: 'Nicholastown/MA',
    email: 'rpowell@garcia-garcia.com',
    status: {
      label: 'BLACK LIST',
      type: 'danger',
    },
    quoteID: null,
    attachedID: null,
    attachedName: null,
    workingDetails: null,
    userName: 'rpowell',
    certificates: [],
    dialogSpeed: '0',
    dialogQuality: '0',
    easeOfSupply: '0',
    supplyCapability: '0',
    euDemandOfParts: '0',
    createdBy: 'system',
    createdOn: 'system',
    lastModifiedBy: 'system',
    lastModifiedOn: 'system',
  },
  {
    id: '3',
    supplierCompany: 'Sullivan, Wright and Aguilar',
    segments: 'RETAIL',
    brand: 'FAR',
    countryInfo: 'Germany',
    pickupaddress: 'Beardport/CT',
    email: 'lauren13@sparks.com',
    status: {
      label: 'NOTCONTACTED',
      type: 'warning',
    },
    quoteID: null,
    attachedID: null,
    attachedName: null,
    workingDetails: null,
    userName: 'lauren13',
    certificates: [],
    dialogSpeed: '0',
    dialogQuality: '0',
    easeOfSupply: '0',
    supplyCapability: '0',
    euDemandOfParts: '0',
    createdBy: 'system',
    createdOn: '',
    lastModifiedBy: 'system',
    lastModifiedOn: '',
  },
  {
    id: '4',
    supplierCompany: 'Johnson, Martin and Cook',
    segments: 'GENERAL',
    brand: 'TRAVEL',
    countryInfo: 'ANY',
    pickupaddress: 'Justinview/TN',
    email: 'williscolin@newman-spencer.com',
    status: {
      label: 'NOTCONTACTED',
      type: 'warning',
    },
    quoteID: null,
    attachedID: null,
    attachedName: null,
    workingDetails: null,
    userName: 'williscolin',
    certificates: [],
    dialogSpeed: '0',
    dialogQuality: '0',
    easeOfSupply: '0',
    supplyCapability: '0',
    euDemandOfParts: '0',
    createdBy: 'system',
    createdOn: '',
    lastModifiedBy: 'system',
    lastModifiedOn: '',
  },{
    id: '5',
    supplierCompany: 'Anderson Ltd',
    segments: 'RETAIL',
    brand: 'UNDERSTAND',
    countryInfo: 'Germany',
    pickupaddress: 'Oliverfurt/WV',
    email: 'avilabrandy@gmail.com',
    status: {
      label: 'NOTCONTACTED',
      type: 'warning',
    },
    quoteID: null,
    attachedID: null,
    attachedName: null,
    workingDetails: null,
    userName: 'avilabrandy',
    certificates: [],
    dialogSpeed: '0',
    dialogQuality: '0',
    easeOfSupply: '0',
    supplyCapability: '0',
    euDemandOfParts: '0',
    createdBy: 'system',
    createdOn: '',
    lastModifiedBy: 'system',
    lastModifiedOn: '',
  },
  {
    id: '6',
    supplierCompany: 'Anderson Ltd',
    segments: 'RETAIL',
    brand: 'UNDERSTAND',
    countryInfo: 'Germany',
    pickupaddress: 'Oliverfurt/WV',
    email: 'avilabrandy@gmail.com',
    status: {
      label: 'NOTCONTACTED',
      type: 'warning',
    },
    quoteID: null,
    attachedID: null,
    attachedName: null,
    workingDetails: null,
    userName: 'avilabrandy',
    certificates: [],
    dialogSpeed: '0',
    dialogQuality: '0',
    easeOfSupply: '0',
    supplyCapability: '0',
    euDemandOfParts: '0',
    createdBy: 'system',
    createdOn: '',
    lastModifiedBy: 'system',
    lastModifiedOn: '',
  },
];

export const searchBySupplierList = async (
  searchTerm: string,
  column?: keyof typeof mockData[0] | 'all'
) => {
  console.log('POST isteği alındı:', { searchTerm, column });
  try {
    // 500 ms gecikme simülasyonu
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Filtreleme başlıyor...');
    
    const filteredData =
      column && column !== 'all'
        ? mockData.filter((item) => {
            const value = item[column];
            const match =
              typeof value === 'string' &&
              value.toLowerCase().includes(searchTerm.toLowerCase());
            console.log(`Sütun: ${column}, Değer: ${value}, Eşleşme: ${match}`);
            return match;

          })
        : mockData.filter((item) =>
            Object.values(item).some((value) => {
              const match =

                typeof value === 'string' &&
                value.toLowerCase().includes(searchTerm.toLowerCase());
              console.log(`Tüm sütunlar, Değer: ${value}, Eşleşme: ${match}`);
              return match;
            })
          );

    console.log('Filtreleme tamamlandı, sonuçlar:', filteredData);

    return {
      statusCode: 200,
      data: filteredData,
      total: filteredData.length,
    };
  } catch (err) {
    console.error('Filtreleme sırasında hata:', err);
    return {
      statusCode: 500,
      message: 'Bir hata oluştu',
      data: [],
    };
  }
};