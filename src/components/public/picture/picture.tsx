import React, { useState, useEffect } from 'react';
import { File } from '../../../services/api';
import { isNullOrEmpty } from '../../../utils';
import CircleLoading from '../loading/CircleLoading';

interface Props {
  fileKey: string;
  className?: string;
}

const Picture: React.FC<Props> = (props) => {
  const { fileKey, className = '' } = props;
  const [file, setFile] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getFile(fileKey: string) {
      const { get } = new File();
      const result = isNullOrEmpty(fileKey) ? '' : await get(fileKey);
      setFile(result == '' ? '' : window.URL.createObjectURL(result));
      setIsLoading(false);
    }
    getFile(fileKey);
  }, []);

  return (
    <>
      {isLoading && <CircleLoading />}
      {!isNullOrEmpty(file) && (
        <img
          width="100%"
          className={className}
          style={{ maxWidth: '500px', maxHeight: '500px' }}
          src={file}
        />
      )}
    </>
  );
};

export default Picture;
