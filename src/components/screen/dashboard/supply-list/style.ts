import { createStyles, makeStyles } from '@material-ui/core';
import { ColorEnum } from 'enum';

export const useStyle = makeStyles((theme) =>
  createStyles({
    label: {
      display: 'flex',
      alignItems: 'center',
      margin: theme.spacing(0, 1),
    },
    calculator: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      bottom: 'auto',
      right: 'auto',
      transform: 'translate(-50%, -50%)',
      zIndex: 99999,
      marginRight: '-50%',
      // height: 'fit-content',
      width: '100%',
      height: '100%',
      background: '#00000070',
      boxShadow: '0 0 40px #000000',
    },
    calcContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      bottom: 'auto',
      right: 'auto',
      transform: 'translate(-50%, -50%)',
      zIndex: 99999,
      marginRight: '-50%',
      height: 'fit-content',
      width: '300px',
      boxShadow: '0 0 40px #000000',
    },
    contentContainer: {
      marginTop: 15,
    },
    blankCard: {
      minHeight: 150,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      height: '100%',
      color: '#C9A3A3',
      '& span': {
        marginTop: 20,
      },
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: theme.spacing(2),
      maxWidth: 600,
    },
    offerInput: {
      width: 50,
    },
    expireDate: {
      display: 'flex',
      alignItems: 'center',
    },
    fieldset: {
      borderColor: ColorEnum.DeepBlue,
      borderRadius: 10,
      color: 'red',
      '& legend': {
        color: '#7e7e7e',
      },
    },
    buttonContainer: {
      marginTop: 15,
    },
    formControl: {
      width: '100%',
      margin: theme.spacing(1),
    },
    cancelButton: {
      color: '#fff',
      backgroundColor: '#5ABC55',
      fontSize: 10,
      float: 'right',
    },
    submitBtn: {
      color: '#fff',
      backgroundColor: '#5ABC55',
      fontSize: 10,
      float: 'right',
    },
    drugTitle: {
      marginBottom: theme.spacing(1),
    },
    formContent: {},
    fab: {
      margin: 0,
      top: 'auto',
      left: 20,
      bottom: 40,
      right: 'auto',
      position: 'fixed',
      backgroundColor: '#54bc54 ',
    },
    sectionContainer: {
      background: 'white',
      borderLeft: `3px solid ${ColorEnum.DeepBlue}`,

      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    input: {
      width: 80,
      marginLeft: 8,
      marginRight: 8,
    },
    calcCloseBtn: {
      fontSize: 10,
      width: 85,
      margin: 4,
      border: `1px solid ${ColorEnum.DeepBlue}`,
    },
    importantMessage: {
      background: 'red',
      color: 'white',
      justifyContent: 'center',
      borderRadius: '0px 5px 5px 0px',
      alignItems: 'center',
      display: 'flex',
    },
  })
);
