import React from 'react';
import { File } from '../../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import { api } from '../../../config/default.json';

interface Props {
  fileKey: string;
  className?: string;
  fileName?: string;
  text?: string;
}

const FileLink: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const {
    fileKey,
    className = 'btn btn-default',
    fileName = '',
    text = t('general.download'),
  } = props;
  const { urls: fileUrls } = new File();

  return (
    <>
      <Button variant="outlined">
        <a
          style={ { textDecoration: 'none', color: '#1e88e5' } }
          className={ className }
          download={ fileName }
          href={ `${api.baseUrl}${fileUrls.get}?key=${fileKey}` }
        >
          <FontAwesomeIcon icon={ faDownload } />
          &nbsp;
          { text }
        </a>
      </Button>
    </>
  );
}

export default FileLink;
