import React, { useState, useEffect } from 'react';
import { File } from '../../../services/api';
import { isNullOrEmpty } from '../../../utils';
import CircleLoading from '../loading/CircleLoading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

interface Props {
  fileKey: string;
  className?: string;
}

const FileLink: React.FC<Props> = (props) => {
  const { fileKey, className = '' } = props;
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
        <>
          <a
            className={ className }
            href={ file }
            target="_blank"
          >
            <FontAwesomeIcon icon={ faDownload } />
            &nbsp;
            { t('general.download') }
          </a>
        </>
      }
    </>
  );
}

export default FileLink;
