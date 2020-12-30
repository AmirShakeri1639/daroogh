import { SaveFavoriteList } from '../../interfaces/favorite';
import Api from './Api';

class Favorite extends Api {
  getFavoriteList = async (): Promise<any> => {
    const result = await this.postData('/Favorite/GetFavorites');
    return result.data;
  };

  saveFavoriteList = async (data: SaveFavoriteList): Promise<any> => {
    const result = await this.postJsonData('/Favorite/SaveAll', data);
    return result.data;
  };
}

export default Favorite;
