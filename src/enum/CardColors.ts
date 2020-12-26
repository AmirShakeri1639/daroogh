import { ColorsEnum } from ".";

export const CardColors = [
  ColorsEnum.White, // unknown = 0
  ColorsEnum.Silver, // NOSEND = 1,
  ColorsEnum.Yellow, // WAITFORB = 2,
  ColorsEnum.DarkYellow, //CONFIRMB_AND_WAITFORA = 3,
  ColorsEnum.DarkGreen, //CONFIRMA_AND_B = 4,
  ColorsEnum.Red, //NOCONFIRMB = 5,
  ColorsEnum.LightRed, //CONFIRMB_AND_NOCONFIRMA = 6,
  ColorsEnum.DarkRed, //CANCELLED = 7,
  ColorsEnum.Blue, //CONFIRMA_AND_B_PAYMENTA = 8,
  ColorsEnum.LightBlue, //CONFIRMA_AND_B_PAYMENTB = 9,
  ColorsEnum.Green, //CONFIRMALL_AND_PAYMENTALL = 10
  ColorsEnum.Silver, // NOSEND = 1+10,
  ColorsEnum.Maroon, // WAITFORB = 2+10,
  ColorsEnum.Cyan, //CONFIRMB_AND_WAITFORA = 3+10,
  ColorsEnum.DarkCyan, //CONFIRMA_AND_B = 4+10,
  ColorsEnum.Purple, //NOCONFIRMB = 5+10,
  ColorsEnum.DarkRed, //CONFIRMB_AND_NOCONFIRMA = 6+10,
  ColorsEnum.DarkRed, //CANCELLED = 7+10,
  ColorsEnum.DarkBlue, //CONFIRMA_AND_B_PAYMENTA = 8+10,
  ColorsEnum.Navy, //CONFIRMA_AND_B_PAYMENTB = 9+10,
  ColorsEnum.Lime, //CONFIRMALL_AND_PAYMENTALL = 10+10
];
