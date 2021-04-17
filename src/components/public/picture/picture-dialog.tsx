import React, { useState } from 'react';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Picture } from '..';
import { useTranslation } from 'react-i18next';
import FileLink from './fileLink';

const useClasses = makeStyles((theme) =>
  createStyles({
    root: {
      minWidth: 500,
      width: '100%',
      maxWidth: 500,
      '& > .MuiCardContent-root': {
        padding: 0,
      },
      '& > .MuiCardHeader-root': {
        padding: '10px 10px 2px 10px',
      },
      '& > .MuiCardHeader-content': {
        marginTop: '-10px !important',
        color: 'red',
      },
    },
  })
);

interface Props {
  fileKey: string;
  title?: string;
  className?: string;
  onClose?: any;
  fileName?: string;
}

const PictureDialog: React.FC<Props> = (props) => {
  const { fileKey, className = '', title = '', onClose, fileName } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { root } = useClasses();
  const [isOpenDialog, setIsOpenDialog] = useState(true);

  return (
    <Dialog open={isOpenDialog} fullScreen={fullScreen} fullWidth={true}>
      <DialogTitle>{title}</DialogTitle>
      <Divider />
      <DialogContent className={root}>
        <Grid container>
          <Grid item xs={12}>
            {(fileName === undefined ||
              (!fileName.endsWith('.jpg') && !fileName.endsWith('.png'))) && (
              <FileLink fileKey={fileKey} fileName={fileName} text={t('general.download')} />
            )}
            {fileName !== undefined && (fileName.endsWith('.jpg') || fileName.endsWith('.png')) && (
              <Picture fileKey={fileKey} className={className} />
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={(): void => {
            setIsOpenDialog(false);
            if (onClose) onClose();
          }}
        >
          {t('general.ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PictureDialog;
