import PasswordModel  from '../schemas/password.schema';
import bcrypt from 'bcrypt';

class PasswordService {
   public async createOrUpdate(data: any) {
       const result = await PasswordModel.findOneAndUpdate({ userId: data.userId }, { $set: { password: data.password } }, { new: true });
       if (!result) {
           const dataModel = new PasswordModel({ userId: data.userId, password: data.password });
           return await dataModel.save();
       }
       return result;
   }

   public async authorize(userId: string, password: string) {
       try {
           const result = await PasswordModel.findOne({ userId: userId, password: password });
           if (result) {
               return true;
           }
       } catch (error) {
           console.error('Wystąpił błąd podczas tworzenia danych:', error);
           throw new Error('Wystąpił błąd podczas tworzenia danych');
       }

   }

   async hashPassword(password: string): Promise<string> {
       const saltRounds = 10;
       const hashedPassword = await bcrypt.hash(password, saltRounds);
       console.log('hash', hashedPassword)
       return hashedPassword;
   }

    public async verifyPassword(userId: string, plainPassword: string): Promise<boolean> {
        try {
            const passwordData = await PasswordModel.findOne({ userId });
            if (!passwordData) {
                throw new Error('Hasło dla tego użytkownika nie istnieje');
            }

            return bcrypt.compare(plainPassword, passwordData.password);
        } catch (error) {
            console.error('Błąd podczas weryfikacji hasła:', error);
            throw new Error('Błąd podczas weryfikacji hasła');
        }
    }

}

export default PasswordService;