import  UserModel  from '../schemas/user.schema';
import {IUser} from "../models/user.model";

class UserService {
   public async createNewOrUpdate(user: IUser) {
       console.log(user)
       try {
           if (!user._id) {
               const dataModel = new UserModel(user);
               return await dataModel.save();
           } else {
               return await UserModel.findByIdAndUpdate(user._id, { $set: user }, { new: true });
           }
       } catch (error) {
           console.error('Wystąpił błąd podczas tworzenia danych:', error);
           throw new Error('Wystąpił błąd podczas tworzenia danych');
       }
   }

   public async getByEmailOrName(name: string) {
    try {
        const result = await UserModel.findOne({ $or: [{ email: name }, { name: name }] });
        if (result) {
            return result;
        }
    } catch (error) {
        console.error('Wystąpił błąd podczas pobierania danych:', error);
        throw new Error('Wystąpił błąd podczas pobierania danych');
    }
}

    public async getById(userId: string) {
        try {
            const user = await UserModel.findById(userId);
            if (user) {
                return user;
            } else {
                throw new Error('Użytkownik nie znaleziony');
            }
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania użytkownika po ID:', error);
            throw new Error('Wystąpił błąd podczas pobierania użytkownika');
        }
    }
    
}

export default UserService;

