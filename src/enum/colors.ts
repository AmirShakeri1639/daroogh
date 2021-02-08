export enum ColorEnum {
  White = '#ffffff',
  Green = '#4caf50',
  Red = '#f44336',
  Gray = '#455a64',
  PaleGray = '#9e9e9e',
  Silver = '#e0e0e0',
  Yellow = '#ffeb3b',
  DarkGreen ='#009688',
  LightRed ='#d34a2f',
  DarkRed ='#a53030',
  Blue ='#03a9f4',
  LightBlue ='#71caf2',
  DarkYellow ='#d4c227',
  LightGreen ='#a0dc39',
  Cyan ='#00bcd4',
  DarkCyan ='#0097a7',
  Maroon ='#e91e63',
  Purple ='#9c27b0',
  Orange ='#ff9800',
  DarkBlue ='#1e88e5',
  Navy ='#3f51b5',
  Lime ='#8dff3b',
  GOLD = '#ffb300',
  SILVER = '#9e9e9e',
  BRONZE = '#cd7f32',
  PLATINUM = '#a0b2c6',
  AddedByB = '#00cc00',
  Confirmed = '#33ff33',
  NotConfirmed = '#009900',
}

export const CardColors = [
  ColorEnum.White, // unknown = 0
  ColorEnum.Silver, // NOSEND = 1,
  ColorEnum.Yellow, // WAITFORB = 2,
  ColorEnum.DarkYellow, //CONFIRMB_AND_WAITFORA = 3,
  ColorEnum.DarkGreen, //CONFIRMA_AND_B = 4,
  ColorEnum.Red, //NOCONFIRMB = 5,
  ColorEnum.LightRed, //CONFIRMB_AND_NOCONFIRMA = 6,
  ColorEnum.DarkRed, //CANCELLED = 7,
  ColorEnum.Blue, //CONFIRMA_AND_B_PAYMENTA = 8,
  ColorEnum.LightBlue, //CONFIRMA_AND_B_PAYMENTB = 9,
  ColorEnum.Green, //CONFIRMALL_AND_PAYMENTALL = 10
  ColorEnum.Silver, // NOSEND = 1+10,
  ColorEnum.Maroon, // WAITFORB = 2+10,
  ColorEnum.Cyan, //CONFIRMB_AND_WAITFORA = 3+10,
  ColorEnum.DarkCyan, //CONFIRMA_AND_B = 4+10,
  ColorEnum.Purple, //NOCONFIRMB = 5+10,
  ColorEnum.DarkRed, //CONFIRMB_AND_NOCONFIRMA = 6+10,
  ColorEnum.DarkRed, //CANCELLED = 7+10,
  ColorEnum.DarkBlue, //CONFIRMA_AND_B_PAYMENTA = 8+10,
  ColorEnum.Navy, //CONFIRMA_AND_B_PAYMENTB = 9+10,
  ColorEnum.Lime, //CONFIRMALL_AND_PAYMENTALL = 10+10
];

export const UserColors = [
  ColorEnum.White,
  ColorEnum.GOLD,
  ColorEnum.SILVER,
  ColorEnum.BRONZE,
  ColorEnum.PLATINUM
];
