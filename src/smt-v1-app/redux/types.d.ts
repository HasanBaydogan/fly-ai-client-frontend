interface UserState {
  user: {
    email: string;
  };
}
interface RFQMail {
  id: string; // Unique identifier
  subject: string; // Mail subject
  body: string; // Mail content
  sender: string; // Sender's email
}
