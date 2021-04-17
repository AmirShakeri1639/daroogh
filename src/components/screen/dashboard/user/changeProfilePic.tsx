import { User } from '../../../../services/api';
import {
  errorHandler,
  tError
} from 'utils';
import { File } from '../../../../services/api';
import { tSimple } from 'utils/toast';

const saveToStorage = async (imageKey: string): Promise<any> => {
  const userDataFromStorage = localStorage.getItem('user');
  const userData = JSON.parse(userDataFromStorage ?? '{}');
  userData.imageKey = imageKey;
  localStorage.setItem('user', JSON.stringify(userData));
  const fileApi = new File();
  const blob = await fileApi.get(imageKey);
  localStorage.setItem('avatar', window.URL.createObjectURL(blob));
}

const uploadProfilePic = async (userId: number | string, file: any): Promise<any> => {
  try {
    const user = new User();
    const response = await user.changeProfileImage(userId, file);
    await saveToStorage(response.data.pictureFileKey);
    tSimple(response.message)
    return response.data.pictureFileKey;
  } catch (e) {
    errorHandler(e)
  }
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
    tError('فایل انتخاب شده دارای فرمت تصویری مناسب نیست.');
  }
  return done;
}

export default changeProfilePic;
