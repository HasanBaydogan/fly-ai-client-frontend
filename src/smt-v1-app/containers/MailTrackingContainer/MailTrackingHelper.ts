export const getActiveStatusFromStringStatus = (stringActiveStatus: string) => {
  switch (stringActiveStatus) {
    case 'All':
      return 'ALL';
    case 'My Issues':
      return 'MY_ISSUES';
    case 'Unread':
      return 'UNREAD';
    case 'Open':
      return 'OPEN';
    case 'WFS':
      return 'WFS';
    case 'PQ':
      return 'PQ';
    case 'FQ':
      return 'FQ';
    case 'NOT RFQ':
      return 'NOT_RFQ';
    case 'NO Quote':
      return 'NO_QUOTE';
    case 'Released 120 Hours':
      return 'RELEASED_120_HOURS';
    default:
      return 'ALL';
  }
};
