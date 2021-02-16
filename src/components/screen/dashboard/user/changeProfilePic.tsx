import React, { useEffect } from 'react';

const changeProfilePic = (userId: number | string = 0): void => {
  const inputFile = document.createElement('input');
  inputFile.type = 'file';
  inputFile.accept = 'image/jpeg'
  inputFile.addEventListener('change', (e: any): void => {
    if (e.target.files.length > 0) {
      const files = e.target.files;
      if (files[0].type.startsWith('image/')) {
        uploadProfilePic(userId, files[0]);
      } else {
        window.alert('NOT an IMage');
      }
    }
  });
  inputFile.click();
}

const uploadProfilePic = (userId: number | string, file: any): void => {
  console.log('id:', userId);
  console.log('file:', file);

}

export default changeProfilePic;
