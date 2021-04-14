import { Button, createStyles, makeStyles, TextField } from '@material-ui/core';
import React from 'react';
import noImage from '../../../assets/images/no-image.png';

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
}

const Uploader = (props: UploaderPI): JSX.Element => {
  const {
    getFile, handleOnSave, showSaveClick = false,
    onDelete
  } = props;
  const { input, ulStyle } = useStyle();
  const [file, setFile] = React.useState<any>();
  const [fileName, setFileName] = React.useState<string>();
  return (
    <ul className={ ulStyle }>
      <li>
        <img
          src={ file ? file : noImage }
          width={ 50 }
          height={ 50 }
          style={ {
            border: '1px solid silver',
            borderRadius: 5,
            marginTop: 6,
            marginRight: 5,
          } }
        ></img>
      </li>
      <li>
        <TextField
          style={ {
            marginTop: -2,
            marginBottom: 5,
            marginRight: 10,
            fontSize: 10,
            minWidth: 160,
          } }
          size="small"
          defaultValue="فایلی انتخاب نشده است"
          value={ fileName }
          inputProps={ {
            readOnly: true,
            style: { fontSize: 10, textAlign: 'center' },
          } }
        />
      </li>
      <li>
        <input
          accept="image/*"
          className={ input }
          id="contained-button-file"
          multiple
          type="file"
          onChange={ (e): void => {
            if (e.target.files) {
              let reader = new FileReader();
              reader.onload = (e) => {
                setFile(e?.target?.result);
              };
              reader.readAsDataURL(e.target.files[0]);
              getFile(e.target.files[0]);
              setFileName(e.target.files[0].name);
              e.target.value = '';
            }
          } }
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            size="small"
            style={ { marginRight: 10 } }
          >
            دریافت فایل
          </Button>
        </label>
        <Button
          style={ { marginRight: 10 } }
          variant="contained"
          color="secondary"
          component="span"
          size="small"
          onClick={ () => {
            setFile(null);
            setFileName('فایلی انتخاب نشده است');
            if (onDelete) onDelete()
          } }
        >
          حذف
        </Button>
        { showSaveClick && (
          <Button
            style={ { marginRight: 10, backgroundColor: 'green', color: 'white' } }
            variant="contained"
            component="span"
            size="small"
            onClick={ () => {
              if (handleOnSave) handleOnSave(file);
            } }
          >
            ذخیره
          </Button>
        ) }
      </li>
    </ul>
  );
};

export default Uploader;
