import React from 'react';

export interface OtpContextInterface {
  activeStep: number;
  setActiveStep: (step: number) => void;
  mobile: string;
  setMobile: (mobile: string) => void;
  ticketId: string;
  setTicketId: (tocketId: string) => void;
}

const DrugTransferContext = React.createContext<OtpContextInterface>({
  activeStep: 0,
  setActiveStep: () => 0,

  setMobile: () => void '',
  mobile: '',
  setTicketId: () => void '',
  ticketId: '',
});

export default OtpContextInterface;
