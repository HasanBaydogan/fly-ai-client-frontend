import { BadgeBg } from 'components/base/Badge';

export interface Status {
  ongoing: number;
  critical: number;
  inactive: number;
  completed: number;
}

export interface Project {
  id: number;
  supplierCompany: string;
  segment: string;
  brand: string;
  countryInfo: string;
  email: string;
  pickupaddress: string;
  status: {
    label: string;
    type: BadgeBg;
  };
}

export const projects: Project[] = [
  {
    id: 1,
    supplierCompany: 'Avionics Interface Technologies',
    segment: 'GENERAL',
    brand: 'VIKING',
    countryInfo: 'ANY',
    pickupaddress: 'Izmir/Urla',
    email: 'hasan@gmail.com',
    status: {
      label: 'completed',
      type: 'success'
    },
  },
  {
    id: 2,
    supplierCompany: 'Frey, Lloyd and Pena',
    segment: 'HEALTH',
    brand: 'CENTER',
    countryInfo: 'ANY',
    pickupaddress: 'Sharonborough/WA',
    email: 'greenamy@yahoo.com',
    status: {
        label: 'pending',
        type: 'info'
    }
},
{
    id: 3,
    supplierCompany: 'Adams, Mullins and Ruiz',
    segment: 'RETAIL',
    brand: 'ALWAYS',
    countryInfo: 'Germany',
    pickupaddress: 'Nicholastown/MA',
    email: 'rpowell@garcia-garcia.com',
    status: {
        label: 'in progress',
        type: 'info'
    }
},
{
    id: 4,
    supplierCompany: 'Sullivan, Wright and Aguilar',
    segment: 'RETAIL',
    brand: 'FAR',
    countryInfo: 'Germany',
    pickupaddress: 'Beardport/CT',
    email: 'lauren13@sparks.com',
    status: {
        label: 'in progress',
        type: 'warning'
    }
},
{
    id: 5,
    supplierCompany: 'Johnson, Martin and Cook',
    segment: 'GENERAL',
    brand: 'TRAVEL',
    countryInfo: 'ANY',
    pickupaddress: 'Justinview/TN',
    email: 'williscolin@newman-spencer.com',
    status: {
        label: 'pending',
        type: 'warning'
    }
},
{
    id: 6,
    supplierCompany: 'Anderson Ltd',
    segment: 'RETAIL',
    brand: 'UNDERSTAND',
    countryInfo: 'Germany',
    pickupaddress: 'Oliverfurt/WV',
    email: 'avilabrandy@gmail.com',
    status: {
        label: 'in progress',
        type: 'info'
    }
},
{
  id: 1,
  supplierCompany: 'Avionics Interface Technologies',
  segment: 'GENERAL',
  brand: 'VIKING',
  countryInfo: 'ANY',
  pickupaddress: 'Izmir/Urla',
  email: 'hasan@gmail.com',
  status: {
    label: 'completed',
    type: 'success'
  },
},
{
  id: 2,
  supplierCompany: 'Frey, Lloyd and Pena',
  segment: 'HEALTH',
  brand: 'CENTER',
  countryInfo: 'ANY',
  pickupaddress: 'Sharonborough/WA',
  email: 'greenamy@yahoo.com',
  status: {
      label: 'pending',
      type: 'info'
  }
},
{
  id: 3,
  supplierCompany: 'Adams, Mullins and Ruiz',
  segment: 'RETAIL',
  brand: 'ALWAYS',
  countryInfo: 'Germany',
  pickupaddress: 'Nicholastown/MA',
  email: 'rpowell@garcia-garcia.com',
  status: {
      label: 'in progress',
      type: 'info'
  }
},
{
  id: 4,
  supplierCompany: 'Sullivan, Wright and Aguilar',
  segment: 'RETAIL',
  brand: 'FAR',
  countryInfo: 'Germany',
  pickupaddress: 'Beardport/CT',
  email: 'lauren13@sparks.com',
  status: {
      label: 'in progress',
      type: 'warning'
  }
},
{
  id: 5,
  supplierCompany: 'Johnson, Martin and Cook',
  segment: 'GENERAL',
  brand: 'TRAVEL',
  countryInfo: 'ANY',
  pickupaddress: 'Justinview/TN',
  email: 'williscolin@newman-spencer.com',
  status: {
      label: 'pending',
      type: 'warning'
  }
},
{
  id: 6,
  supplierCompany: 'Anderson Ltd',
  segment: 'RETAIL',
  brand: 'UNDERSTAND',
  countryInfo: 'Germany',
  pickupaddress: 'Oliverfurt/WV',
  email: 'avilabrandy@gmail.com',
  status: {
      label: 'in progress',
      type: 'info'
  }
},
{
  id: 1,
  supplierCompany: 'Avionics Interface Technologies',
  segment: 'GENERAL',
  brand: 'VIKING',
  countryInfo: 'ANY',
  pickupaddress: 'Izmir/Urla',
  email: 'hasan@gmail.com',
  status: {
    label: 'completed',
    type: 'success'
  },
},
{
  id: 2,
  supplierCompany: 'Frey, Lloyd and Pena',
  segment: 'HEALTH',
  brand: 'CENTER',
  countryInfo: 'ANY',
  pickupaddress: 'Sharonborough/WA',
  email: 'greenamy@yahoo.com',
  status: {
      label: 'pending',
      type: 'info'
  }
},
{
  id: 3,
  supplierCompany: 'Adams, Mullins and Ruiz',
  segment: 'RETAIL',
  brand: 'ALWAYS',
  countryInfo: 'Germany',
  pickupaddress: 'Nicholastown/MA',
  email: 'rpowell@garcia-garcia.com',
  status: {
      label: 'in progress',
      type: 'info'
  }
},
{
  id: 4,
  supplierCompany: 'Sullivan, Wright and Aguilar',
  segment: 'RETAIL',
  brand: 'FAR',
  countryInfo: 'Germany',
  pickupaddress: 'Beardport/CT',
  email: 'lauren13@sparks.com',
  status: {
      label: 'in progress',
      type: 'warning'
  }
},
{
  id: 5,
  supplierCompany: 'Johnson, Martin and Cook',
  segment: 'GENERAL',
  brand: 'TRAVEL',
  countryInfo: 'ANY',
  pickupaddress: 'Justinview/TN',
  email: 'williscolin@newman-spencer.com',
  status: {
      label: 'pending',
      type: 'warning'
  }
},
{
  id: 6,
  supplierCompany: 'Anderson Ltd',
  segment: 'RETAIL',
  brand: 'UNDERSTAND',
  countryInfo: 'Germany',
  pickupaddress: 'Oliverfurt/WV',
  email: 'avilabrandy@gmail.com',
  status: {
      label: 'in progress',
      type: 'info'
  }
},
{
id: 1,
supplierCompany: 'Avionics Interface Technologies',
segment: 'GENERAL',
brand: 'VIKING',
countryInfo: 'ANY',
pickupaddress: 'Izmir/Urla',
email: 'hasan@gmail.com',
status: {
  label: 'completed',
  type: 'success'
},
},
{
id: 2,
supplierCompany: 'Frey, Lloyd and Pena',
segment: 'HEALTH',
brand: 'CENTER',
countryInfo: 'ANY',
pickupaddress: 'Sharonborough/WA',
email: 'greenamy@yahoo.com',
status: {
    label: 'pending',
    type: 'info'
}
},
{
id: 3,
supplierCompany: 'Adams, Mullins and Ruiz',
segment: 'RETAIL',
brand: 'ALWAYS',
countryInfo: 'Germany',
pickupaddress: 'Nicholastown/MA',
email: 'rpowell@garcia-garcia.com',
status: {
    label: 'in progress',
    type: 'info'
}
},
{
id: 4,
supplierCompany: 'Sullivan, Wright and Aguilar',
segment: 'RETAIL',
brand: 'FAR',
countryInfo: 'Germany',
pickupaddress: 'Beardport/CT',
email: 'lauren13@sparks.com',
status: {
    label: 'in progress',
    type: 'warning'
}
},
{
id: 5,
supplierCompany: 'Johnson, Martin and Cook',
segment: 'GENERAL',
brand: 'TRAVEL',
countryInfo: 'ANY',
pickupaddress: 'Justinview/TN',
email: 'williscolin@newman-spencer.com',
status: {
    label: 'pending',
    type: 'warning'
}
},
{
id: 6,
supplierCompany: 'Anderson Ltd',
segment: 'RETAIL',
brand: 'UNDERSTAND',
countryInfo: 'Germany',
pickupaddress: 'Oliverfurt/WV',
email: 'avilabrandy@gmail.com',
status: {
    label: 'in progress',
    type: 'info'
}
}
  
];
