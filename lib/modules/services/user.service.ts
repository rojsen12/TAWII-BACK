import UserModel from '../schemas/user.schema';
import bcrypt from 'bcrypt';

class UserService{
    private saltRounds =10;
    public async login(email:string,password: string){
        try{
            const user = await this.getByEmailOrName(email);
            if(!user){
                throw new Error('User not found');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid){
                throw new Error('Invalid')
            }
            return user;
        } catch (e) {
            console.error('Login failed: ', e);
            throw new Error('Invalid credentials');
        }
    }

    public async getByEmailOrName(name: string) {
        try {
            let result = await UserModel.findOne({email: name});

            if(!result){
                result = await UserModel.findOne({name: name});
            }

            if (result) {
                return result;
            }
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych:', error);
            throw new Error('Wystąpił błąd podczas pobierania danych');
        }
    }

    public async createNewUser(email: string,name: string,password: string){
        try{
            const existingUser = await UserModel.findOne({ $or: [{ email: name }, { name: name }] })
            if (existingUser){
                throw new Error("User with this email exists")
            }

            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
            const newUser = new UserModel({
                email,
                name,
                password: hashedPassword
            });
            await newUser.save();
            return newUser;
        } catch (error) {
            console.error("Error creating new user: ", error)
        }
    }
}

export default UserService;