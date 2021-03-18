import classes from '*.module.css';
import { faInfo, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Backdrop,
  createStyles,
  Fade,
  Icon,
  makeStyles,
  Modal,
  TextField,
  Theme,
} from '@material-ui/core';
import React from 'react';
import { TextFieldCustomeProps } from './TextFieldCustomeProps';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

const TextFieldDaroogh: React.FC<TextFieldCustomeProps> = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };
  return (
    <div
      style={{ display: 'flex', alignItems: 'baseline', flexDirection: 'row' }}
    >
      <TextField style={{ flex: '1' }} {...props} />
      {props.help && (
        <FontAwesomeIcon
          onClick={handleOpen}
          size="1x"
          style={{ cursor: 'pointer' }}
          icon={faInfo}
          color="black"
        />
      )}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <p id="transition-modal-description">{props.help}</p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default TextFieldDaroogh;
