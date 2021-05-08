import { createStyles, makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    notNested: {
      paddingLeft: theme.spacing(2),
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    menuContainer: {
      padding: '1em 0',
      '&:nth-child(even)': {
        backgroundColor: 'white',
      },
    },
    exchangeMenu: {
      background: '#ddd',
      '& *': {
        color: 'navy',
      },
    },
    linkWrapper: {
      display: 'flex',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, .05)',
        transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      },
      '& div': {
        color: '#4625B2',
      },
      '& a': {
        color: '#4625B2',
        textDecoration: 'none',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        '& div:nth-child(2)': {
          display: 'inline-block',
        },
      },
    },
  })
);