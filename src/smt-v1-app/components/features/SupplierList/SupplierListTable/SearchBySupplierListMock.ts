export type SupplierStatus = {
  label: 'CONTACTED' | 'NOT_CONTACTED' | 'BLACK_LISTED';
  type: 'success' | 'warning' | 'danger';
};

export type Certypes =
  | 'CERTIFICATE_1'
  | 'CERTIFICATE_2'
  | 'CERTIFICATE_3'
  | 'CERTIFICATE_4';
