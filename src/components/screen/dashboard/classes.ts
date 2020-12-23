import { makeStyles } from "@material-ui/core/styles";
import { createStyles } from "@material-ui/core";

export const useClasses = makeStyles((theme) => createStyles({
  root: {
    width: 500,
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
  spacing1: {
    margin: theme.spacing(1)
  },
  spacing2: {
    margin: theme.spacing(2)
  },
  spacing3: {
    margin: theme.spacing(3)
  },
  spacingVertical1: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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
    minHeight: 110,
    borderRadius: 14,
    display: 'inline-block',
    position: 'relative',
    margin: theme.spacing(1),
    boxShadow: '0 0 5px #cecece',
  },
  cardTitle: {
    padding: '1em',
    borderRadius: '.5em',
    margin: '.3em 0',
  },
  titleCode: {
    color: '#444',
    position: 'absolute',
    top: '2em',
    right: '1.5em',
  },
  cardTop: {
    margin: '0 .5em',
  },
  pointer: {
    cursor: 'Pointer',
  },
  faIcons: {
    margin: '.3em', 
    marginTop: '0',
  },
}));
