const MAIL_BADGE_PROPERTIES = {
  UNREAD: {
    bgColor: '#6C757D',
    textColor: '#FFFFFF'
  },
  OPEN: {
    bgColor: '#FFC107',
    textColor: '#343A40'
  },
  WFS: {
    bgColor: '#D46C00',
    textColor: '#FFFFFF'
  },
  PQ: {
    bgColor: '#004808',
    textColor: '#FFFFFF'
  },
  FQ: {
    bgColor: '#28A745',
    textColor: '#FFFFFF'
  },
  NOT_RFQ: {
    bgColor: '#272B2F',
    textColor: '#FFFFFF'
  },
  NO_QUOTE: {
    bgColor: '#DC3545',
    textColor: '#FFFFFF'
  },
  SPAM: {
    bgColor: '#FF0018',
    textColor: '#FFFFFF'
  }
};

export default MAIL_BADGE_PROPERTIES;
export function getColorStyles(statusType: string): {
  bgColor: string;
  textColor: string;
} {
  let bgColor = '';
  let textColor = '';
  switch (statusType) {
    case 'UNREAD':
      bgColor = MAIL_BADGE_PROPERTIES.UNREAD.bgColor;
      textColor = MAIL_BADGE_PROPERTIES.UNREAD.textColor;
      break;
    case 'OPEN':
      bgColor = MAIL_BADGE_PROPERTIES.OPEN.bgColor;
      textColor = MAIL_BADGE_PROPERTIES.OPEN.textColor;
      break;
    case 'WFS':
      bgColor = MAIL_BADGE_PROPERTIES.WFS.bgColor;
      textColor = MAIL_BADGE_PROPERTIES.WFS.textColor;
      break;
    case 'PQ':
      bgColor = MAIL_BADGE_PROPERTIES.PQ.bgColor;
      textColor = MAIL_BADGE_PROPERTIES.PQ.textColor;
      break;
    case 'FQ':
      bgColor = MAIL_BADGE_PROPERTIES.FQ.bgColor;
      textColor = MAIL_BADGE_PROPERTIES.FQ.textColor;
      break;
    case 'NOT_RFQ':
      bgColor = MAIL_BADGE_PROPERTIES.NOT_RFQ.bgColor;
      textColor = MAIL_BADGE_PROPERTIES.NOT_RFQ.textColor;
      break;
    case 'NO_QUOTE':
      bgColor = MAIL_BADGE_PROPERTIES.NO_QUOTE.bgColor;
      textColor = MAIL_BADGE_PROPERTIES.NO_QUOTE.textColor;
      break;
    case 'SPAM':
      bgColor = MAIL_BADGE_PROPERTIES.SPAM.bgColor;
      textColor = MAIL_BADGE_PROPERTIES.SPAM.textColor;
      break;
  }
  return { bgColor, textColor };
}
export const mapPointTypeToRfqMailStatus = (
  pointType: 'SPAM' | 'NOT_RFQ' | 'NO_QUOTE' | 'UNREAD'
): RFQMail['rfqMailStatus'] => {
  switch (pointType) {
    case 'SPAM':
      return 'SPAM';
    case 'NOT_RFQ':
      return 'NOT_RFQ'; // Boşluklu formata dönüştürüldü
    case 'NO_QUOTE':
      return 'NO_QUOTE'; // Boşluklu formata dönüştürüldü
    case 'UNREAD':
      return 'UNREAD';
    default:
      throw new Error(`Unknown pointType: ${pointType}`);
  }
};
