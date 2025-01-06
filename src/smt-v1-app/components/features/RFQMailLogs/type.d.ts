interface RFQMailLog {
  userId: string;
  userFullName: string;
  actionType:
    | ASSIGN
    | BLOCK
    | OPEN
    | UPDATE
    | SAVE
    | CANCEL
    | ENTER
    | CREATE
    | CHANGE
    | POINT;
  date: string;
  assignedOrBlockedSubject: {
    userId: string;
    userFullName: string;
  };
  enterItemsNumber: number;
  // Quote is changed
  quoteValues: {
    quote: string;
    statusFrom: RFQMailStatus;
    statusTo: RFQMailStatus;
  };
  changeValues: {
    statusFrom: RFQMailStatus;
    statusTo: RFQMailStatus;
  };
  pointValues: {
    pointStatus: RFQMailStatus;
  };
}

type RFQMailStatus =
  | 'UNREAD'
  | 'OPEN'
  | 'WFS'
  | 'PQ'
  | 'FQ'
  | 'NOT_RFQ'
  | 'NO_QUOTE'
  | 'SPAM';
