import { User } from '../../../../services/api';
import { errorSweetAlert, successSweetAlert } from '../../../../utils';

const saveToStorage = (imageKey: string): void => {
  const userDataFromStorage = localStorage.getItem('user');
  const userData = JSON.parse(userDataFromStorage ?? '{}');
  userData.imageKey = imageKey;
  localStorage.setItem('user', JSON.stringify(userData));
}

const uploadProfilePic = async (userId: number | string, file: any): Promise<any> => {
  const user = new User();
  const response = await user.changeProfileImage(userId, file);
  saveToStorage(response.data.pictureFileKey);
  return response.data.pictureFileKey;
}

const changeProfilePic = async (
  userId: number | string = 0, file: any = undefined
): Promise<any> => {
  let done = false;
  if (userId === 0 || file === undefined) {
    return false;
  }
  if (file.type.startsWith('image/')) {
    done = await uploadProfilePic(userId, file);
  } else {
    errorSweetAlert('فایل انتخاب شده دارای فرمت تصویری مناسب نیست.');
  }
  return done;
}

export default changeProfilePic;
