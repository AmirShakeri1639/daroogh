import React from "react";

export interface TransferDrugContextInterface {
  activeStep: number;
  setActiveStep: (page: number) => void;
}

const DrugTransferContext = React.createContext<TransferDrugContextInterface>({
  activeStep: 0,
  setActiveStep: () => {},
});

export default DrugTransferContext;
