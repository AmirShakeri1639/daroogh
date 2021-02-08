import React, { useState, useEffect } from 'react';
import { File } from '../../../services/api';
import { isNullOrEmpty } from '../../../utils';
import CircleLoading from '../loading/CircleLoading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';

interface Props {
  fileKey: string;
  className?: string;
  fileName?: string;
}

const FileLink: React.FC<Props> = (props) => {
  const {
    fileKey,
    className = 'btn btn-default',
    fileName = fileKey
  } = props;
  const { t } = useTranslation();
  const [file, setFile] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getFile(fileKey: string) {
      const { get } = new File();
      const result =
        isNullOrEmpty(fileKey)
          ? ''
          : await get(fileKey);
      setFile(result == '' ? '' : window.URL.createObjectURL(result));
      setIsLoading(false);
    }
    getFile(fileKey);
  }, []);

  return (
    <>
      { isLoading && <CircleLoading /> }
      { !isNullOrEmpty(file) &&
        <Button variant="outlined">
          <a
            style={ { textDecoration: 'none', color: '#1e88e5' } }
            className={ className }
            href={ file }
            download={ fileName }
            target="_blank"
          >
            <FontAwesomeIcon icon={ faDownload } />
            &nbsp;
            { t('general.download') }
          </a>
        </Button>
      }
    </>
  );
}

export default FileLink;
