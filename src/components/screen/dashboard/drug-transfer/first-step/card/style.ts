import { createStyles, makeStyles } from "@material-ui/core";
import { ColorEnum } from "enum";

export const useStyle = makeStyles(() =>
  createStyles({
    userLevelContainer: {
      display: 'flex',
      alignItems: 'center',
      '& span:nth-child(1)': {
        width: 12,
        height: 12,
        borderRadius: '50%',
        marginRight: 5,
        display: 'inline-block',
        '&.gold': {
          backgroundColor: '#ffd700',
        },
        '&.silver': {
          backgroundColor: '#c0c0c0',
        },
        '&.boronze': {
          backgroundColor: '#cd7f32',
        },
        '&.platinium': {
          background: '#E5E4E2',
        },
        '& svg': {
          width: 10,
          height: 10,
          color: 'white',
          marginLeft: 1,
          marginBottom: 1,
        },
      },
    },
    starIcon: {
      color: '#ffc65d',
    },
    headerBack: {
      background: ColorEnum.LiteBack,
      margin: '4px 4px 8px 4px',
      borderRadius: '8px 8px 0px 0px',
      padding: 4
    },
    logoType: {
      width: '60px',
      height: '60px',
      maxWidth: '100%',
      maxHeight: '100%',
      verticalAlign: 'middle',
    },
    pharmacyName: {
      fontSize: '15px',
      color: '#0d810d',
    },

  })
);
