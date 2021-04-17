import React from 'react';
import { Button, createStyles, makeStyles, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import noImage from '../../../assets/images/no-image.png';
import { isNullOrEmpty } from 'utils';

const useStyle = makeStyles((theme) =>
  createStyles({
    input: {
      display: 'none',
    },
    ulStyle: {
      listStyle: 'none',
      textAlign: 'center',
      border: '1px solid silver',
      borderRadius: 5,
      padding: 3,
      marginTop: 0,
      display: 'flex',
      alignItems: 'center',
    },
  })
);

interface UploaderPI {
  showSaveClick?: boolean;
  getFile: (e: any) => void;
  handleOnSave?: (e: any) => void;
  onDelete?: () => void;
  keyId?: string;
  multiple?: boolean;
  accept?: string;
}

const Uploader: React.FC<UploaderPI> = (props) => {
  const {
    getFile,
    handleOnSave,
    showSaveClick = false,
    onDelete,
    keyId = '',
    multiple = false,
    accept = 'image/*',
  } = props;

  const { t } = useTranslation();
  const { input, ulStyle } = useStyle();
  const [file, setFile] = React.useState<any>();
  const [fileName, setFileName] = React.useState<string>();

  return (
    <ul className={ulStyle}>
      <li>
        <img
          src={file ? file : noImage}
          width={50}
          height={50}
          style={{
            border: '1px solid silver',
            borderRadius: 5,
            marginTop: 6,
            marginRight: 5,
          }}
        ></img>
      </li>
      <li>
        <TextField
          style={{
            marginTop: -2,
            marginBottom: 5,
            marginRight: 10,
            fontSize: 10,
            minWidth: 160,
          }}
          size="small"
          defaultValue={t('file.noFileSelected')}
          value={fileName}
          inputProps={{
            readOnly: true,
            style: { fontSize: 10, textAlign: 'center' },
          }}
        />
      </li>
      <li>
        <input
          accept={accept}
          className={input}
          key={`contained-button-file_${keyId}`}
          id={`contained-button-file_${keyId}`}
          multiple={multiple}
          type="file"
          onChange={(e): void => {
            if (e.target.files) {
              getFile(multiple ? e.target.files : e.target.files[0]);
              let reader = new FileReader();
              reader.onload = (e) => {
                setFile(e?.target?.result);
              };
              reader.readAsDataURL(e.target.files[0]);
              setFileName(e.target.files[0].name);
              e.target.value = '';
            }
          }}
        />
        <label htmlFor={`contained-button-file_${keyId}`}>
          <Button
            variant="contained"
            color="primary"
            component="span"
            size="small"
            style={{ marginRight: 10 }}
          >
            {t('file.get')}
          </Button>
        </label>
        {!isNullOrEmpty(file) && (
          <Button
            style={{ marginRight: 10 }}
            variant="contained"
            color="secondary"
            component="span"
            size="small"
            onClick={() => {
              setFile(null);
              setFileName(t('file.noFileSelected'));
              if (onDelete) onDelete();
            }}
          >
            {t('file.delete')}
          </Button>
        )}

        {showSaveClick && (
          <Button
            style={{ marginRight: 10, backgroundColor: 'green', color: 'white' }}
            variant="contained"
            component="span"
            size="small"
            onClick={() => {
              if (handleOnSave) handleOnSave(file);
            }}
          >
            {t('file.save')}
          </Button>
        )}
      </li>
    </ul>
  );
};

export default Uploader;
