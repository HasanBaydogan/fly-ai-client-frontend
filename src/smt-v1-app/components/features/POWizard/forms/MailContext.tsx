import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren
} from 'react';

interface MailContextType {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  content: string;
  attachments: File[];
  quoteId: string;
  rfqId: string;
  setMailData: (data: Partial<MailContextType>) => void;
}

const MailContext = createContext<MailContextType>({
  to: [],
  cc: [],
  bcc: [],
  subject: '',
  content: '',
  attachments: [],
  quoteId: '',
  rfqId: '',
  setMailData: () => {}
});

export const MailProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [mailData, setMailData] = useState<
    Omit<MailContextType, 'setMailData'>
  >({
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    content: '',
    attachments: [],
    quoteId: '',
    rfqId: ''
  });

  const updateMailData = (
    data: Partial<Omit<MailContextType, 'setMailData'>>
  ) => {
    setMailData(prev => ({ ...prev, ...data }));
  };

  return (
    <MailContext.Provider value={{ ...mailData, setMailData: updateMailData }}>
      {children}
    </MailContext.Provider>
  );
};

export const useMail = () => useContext(MailContext);
