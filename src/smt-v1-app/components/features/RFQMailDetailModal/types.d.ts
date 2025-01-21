interface RFQMailDetail {
  allUsers: RFQMailDetailUser[];
  assignToResponse: {
    userFullName: string;
    userId: string;
  };
  blockToResponse: {
    userFullName: string;
    userId: string;
  };
  rfqMailNumberRefId: string;
  content: string;
  deadline: string;
  from: string;
  rfqMailId: string;
  rfqMailStatus:
    | 'UNREAD'
    | 'OPEN'
    | 'WFS'
    | 'PQ'
    | 'FQ'
    | 'NOT_RFQ'
    | 'NO_QUOTE'
    | 'SPAM';
  subject: string;
}
interface RFQMailDetailUser {
  userId: string;
  userFullName: string;
}
