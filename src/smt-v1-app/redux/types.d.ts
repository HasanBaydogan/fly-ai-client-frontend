interface UserState {
  user: {
    email: string;
  };
}
interface RFQMail {
  rfqMailId: string; // Unique identifier
  rfqNumberId:string;
  rfqMailStatus:  
  'UNREAD'
  | 'OPEN'
  | 'WFS'
  | 'PQ'
  | 'FQ'
  | 'NOT RFQ'
  | 'NO QUOTE'
  | 'SPAM'; // Mail subject
  assignTo: string | null; // Mail content
  comment: string | null;
  emailSender:string; 
  isNoQuote: boolean;
  isNotRFQ: boolean;
  isSpam:boolean;
  mailSentDate:string;
  pricedProductCount:number;
  totalProductCount:number;
  shortEmailContent:string;


}
