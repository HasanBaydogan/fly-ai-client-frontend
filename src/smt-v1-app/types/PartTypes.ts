export interface PartData {
  partId: string;
  partNumber: string;
  partName: string;
  segments: string[];
  aircraft: string;
  aircraftModel: string;
  oems: string[];
  hsCode: string;
}
export interface postFile {
  partId: string;
  fileName: string;
  description: string;
  data: string;
  fileSize: number;
  fileSizeUnit: string;
}
export interface TreeNode {
  segmentId: string;
  segmentName: string;
  isSelected?: boolean;
  subSegments: TreeNode[];
}
export interface newNotePayload {
  partId: string;
  noteContent: string;
  partNoteType: string; // Artık dizi değil, tek string olacak
}

export interface createPart {
  partNumber: string;
  partName: string;
  segmentIds: string[];
  aircraftModel: string;
  aircraft: string;
  comment: string;
  oems: string[];
  hsCode: string;
}
export interface updatePartPayload {
  partId: any;
  partName: string;
  aircraft: string;
  segmentIds: string[];
  aircraftModel: string;
  comment: string;
  oems: string[];
  hsCode: string;
}
export interface UDFData {
  udfId: string;
  fieldName: string;
  fieldType: string[];
  fieldStringValues: [string];
  addrfieldIntValuesess: [0];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface createUDF {
  partId: string;
  fieldName: string;
  udfFieldType: string;
  fieldStringValues: string[];
  fieldIntValues: number[];
}
export interface updateFilesPayload {
  id: string;
  description: string;
}

export interface updatePayload {
  noteId: string;
  noteContent: string;
  noteType: string;
}

export type aircraft =
  | 'ANY'
  | 'AIRBUS'
  | 'ALBATROSL_39'
  | 'AGUSTA_WESTLAND'
  | 'BEECRAFT'
  | 'BOEING'
  | 'BOMBARDIER'
  | 'CESSNA'
  | 'DIAMOND'
  | 'LEONARDO'
  | 'L410'
  | 'SSJ100';

export type oem =
  | 'ANY'
  | 'AKZONOBEL'
  | 'BRIDGESTONE'
  | 'CHAMPION'
  | 'CHARLATTE'
  | 'COLUMBUSJACK'
  | 'DAVID_CLARK'
  | 'DIAMOND_AIRCRAFT'
  | 'DUNLOP'
  | 'DYNELL'
  | 'GOODRICH'
  | 'GOODYEAR'
  | 'GROVE'
  | 'HEATCON'
  | 'JBT_AEROTECH'
  | 'MALABAR'
  | 'MALLAGHAN'
  | 'MANITOWOC'
  | 'MICHELIN'
  | 'MILOCO'
  | 'MULAG'
  | 'POTAIN'
  | 'SAFRAN'
  | 'SAGEPARTS'
  | 'SOURIAU'
  | 'TESA_PRODUCTS'
  | 'THALES'
  | 'TRONAIR';
