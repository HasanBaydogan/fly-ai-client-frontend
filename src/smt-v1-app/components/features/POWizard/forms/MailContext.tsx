import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren
} from 'react';

interface EmailRequest {
  to: string[];
  cc: string[];
  subject: string;
  body: string;
  attachments: {
    filename: string;
    data: string;
  }[];
}

interface MailContextType {
  emailRequests: EmailRequest[];
  setEmailRequests: React.Dispatch<React.SetStateAction<EmailRequest[]>>;
  quoteId: string;
  rfqId: string;
  setMailData: (data: Partial<Omit<MailContextType, 'setMailData'>>) => void;
}

const MailContext = createContext<MailContextType>({
  emailRequests: [],
  setEmailRequests: () => {},
  quoteId: '',
  rfqId: '',
  setMailData: () => {}
});

export const MailProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [emailRequests, setEmailRequests] = useState<EmailRequest[]>([]);
  const [mailData, setMailData] = useState<
    Omit<MailContextType, 'setMailData' | 'setEmailRequests'>
  >({
    emailRequests,
    quoteId: '',
    rfqId: ''
  });

  const updateMailData = (
    data: Partial<Omit<MailContextType, 'setMailData'>>
  ) => {
    setMailData(prev => ({ ...prev, ...data }));
  };

  return (
    <MailContext.Provider
      value={{ ...mailData, setEmailRequests, setMailData: updateMailData }}
    >
      {children}
    </MailContext.Provider>
  );
};

export const useMail = () => useContext(MailContext);
