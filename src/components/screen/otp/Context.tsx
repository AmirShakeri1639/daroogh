import React from 'react';

export interface OtpContextInterface {
  
  
  ticketId: string;
  setTicketId: (ticketId: string) => void;
}

const OtpContext = React.createContext<OtpContextInterface>({
 
  setTicketId: () => void '',
  ticketId: '',
});

export default OtpContext;
