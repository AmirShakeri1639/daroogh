import { makeStyles } from "@material-ui/core/styles";
import { createStyles } from "@material-ui/core";
import { ColorEnum } from "../../../enum";



export const useClasses = makeStyles((theme) => createStyles({
  root: {
    minWidth: 500,
    width: '100%',
    maxWidth: 1000,
    '& > .MuiCardContent-root': {
      padding: 0
    },
    '& > .MuiCardHeader-root': {
      padding: '10px 10px 2px 10px'
    },
    '& > .MuiCardHeader-content': {
      marginTop: '-10px !important',
      color: 'red'
    }
  },
  table: {
    minWidth: 650,
  },
  calcRoot: {
    minWidth: 'auto',
    // maxHeight: '70vh',
  },
  limiModalHeight: {
    maxHeight: '80vh',
  },
  container: {
    marginTop: theme.spacing(1),
  },
  gridEditForm: {
    margin: theme.spacing(2, 0, 2),
  },
  cancelButton: {
    background: theme.palette.pinkLinearGradient.main,
    marginLeft: theme.spacing(2),
  },
  checkIcon: {
    color: theme.palette.success.main,
  },
  rtl: {
    direction: 'rtl'
  },
  ltr: {
    direction: 'ltr'
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 2),
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      // width: '25ch',
    },
  },
  titleContainer: {
    padding: theme.spacing(2)
  },
  formTitle: {
    margin: 0
  },
  addButton: {
    background: theme.palette.blueLinearGradient.main,
  },
  box: {
    '& > .MuiFormControl-root': {
      flexGrow: 1,
    }
  },
  parent: {
    paddingTop: theme.spacing(2),
  },
  formPaper: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2, 0, 2),
  },
  dialogBig: {
    maxWidth: '90vw',
  },
  spacingHalf: {
    margin: theme.spacing(.5)
  },
  spacing1: {
    margin: theme.spacing(1)
  },
  spacing2: {
    margin: theme.spacing(2)
  },
  spacing3: {
    margin: theme.spacing(3)
  },
  padding2: {
    padding: theme.spacing(2)
  },
  spacingVertical1: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: 0,
    marginRight: 0,
  },
  spacingVertical3: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: 0,
    marginRight: 0,
  },
  formControl: {
    minWidth: 190,
    margin: theme.spacing(1),
  },
  gridContainer: {
    flexGrow: 1
  },
  gridFormControl: {
    margin: theme.spacing(3),
  },
  gridTitle: {
    marginLeft: theme.spacing(2),
  },
  gridItem: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  formBody: {
    display: 'flex',
    alignItems: 'center',
  },
  dropdown: {
    margin: theme.spacing(1),
    minWidth: '100%',
  },
  silverBackground: {
    background: '#ebebeb',
  },
  rootFull: {
    flexGrow: 1,
    margin: theme.spacing(1)
  },
  formItem: {
    display: 'flex',
    justifySelf: 'stretch',
    margin: theme.spacing(1)
  },
  formItemSmall: {
    // display: 'flex',
    // justifySelf: 'stretch',
    width: '5em',
    margin: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  stickyToolbox: {
    position: 'sticky',
    margin: 0,
    top: 70,
    zIndex: 999,
    backgroundColor: '#f3f3f3',
    boxShadow: '0px 0px 3px 3px silver',
  },
  stickyRecommendation: {
    position: 'sticky',
    margin: 0,
    padding: 10,
    paddingTop: 0,
    top: 135,
    zIndex: 999,
  },
  cardContent: {
    borderRadius: 15,
    width: '100%',
    padding: 0,
  },
  cardContainer: {
    padding: 5,
    minHeight: 170,
    alignItems: 'center',
    fontSize: 11,
  },
  ulCardName: {
    padding: 0,
    textAlign: 'left',
    listStyleType: 'none',
  },
  rowRight: {
    display: 'flex',
    alignItems: 'right',
  },
  rowLeft: {
    display: 'table',
    textAlign: 'right',
  },
  colLeft: {
    display: 'flex',
    alignItems: 'left',
    justifyContent: 'flex-end',
  },
  cardRoot: {
    width: '100%',
    maxWidth: '35em',
    minHeight: 110,
    borderRadius: 14,
    display: 'inline-block',
    position: 'relative',
    margin: theme.spacing(1),
    boxShadow: '0 0 5px #cecece',
  },
  cardTitle: {
    padding: '.65em',
    borderRadius: '.5em',
    margin: '.3em 0',
    fontSize: '1.2em',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  titleCode: {
    color: '#444',
    position: 'absolute',
    top: '2em',
    right: '1.5em',
    padding: '.5em',
    paddingBottom: '.2em',
    background: 'rgba(225, 245, 254, .7)',
    borderRadius: '.5em',
    // borderBottomRightRadius: '0',
    // borderTopLeftRadius: '0',
  },
  cardTop: {
    margin: '0 .5em',
  },
  pointer: {
    cursor: 'Pointer',
  },
  faIcons: {
    margin: '0 .3em', 
  },
  ul: {
    listStyle: 'none',
    paddingLeft: 0,
    '& > li': {
      display: 'inline',
      marginLeft: theme.spacing(2),
      color: theme.palette.gray.dark,
      '&:hover': {
        cursor: 'pointer',
      },
      '& > span': {
        color: theme.palette.gray.dark,
        bottom: 1,
        left: 3,
      },
    },
  },
  icons: {
    color: theme.palette.gray.dark,
  },
  darkText: {
    color: ColorEnum.Gray,
  },
  longItem: {
    width: '75%',
  },
  centerItem: {
    display: 'flex',
    margin: 'auto'
  },
  smallImage: {
    maxWidth: '300px',
    maxHeight: '300px',
  },
}));
