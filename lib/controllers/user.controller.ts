import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import {auth} from '../middlewares/auth.middleware';
import {admin} from '../middlewares/admin.middleware';
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from '../modules/services/token.service';


class UserController implements Controller {
   public path = '/api/user';
   public router = Router();
   private userService = new UserService();
   private passwordService = new PasswordService();
   private tokenService = new TokenService();

   constructor() {
       this.initializeRoutes();
   }

   private initializeRoutes() {
       this.router.post(`${this.path}/create`, this.createNewOrUpdate);
       this.router.post(`${this.path}/auth`, this.authenticate);
       this.router.delete(`${this.path}/logout/:userId`, auth, this.removeHashSession);
       this.router.post(`${this.path}/reset`, this.resetPassword);
       this.router.patch(`${this.path}/change-password`, auth, this.changePassword);
   }

   private authenticate = async (request: Request, response: Response, next: NextFunction) => {
    const {login, password} = request.body;

    try {
        const user = await this.userService.getByEmailOrName(login);
        if (!user) {
            return response.status(401).json({error: 'Unauthorized'});
        }
        await this.passwordService.authorize(user._id, await this.passwordService.hashPassword(password));
        const token = await this.tokenService.create(user);
        response.status(200).json(this.tokenService.getToken(token));
    } catch (error: unknown) {
        console.error(`Validation Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        response.status(401).json({ error: 'Unauthorized' });
    }
 };
 
 private createNewOrUpdate = async (request: Request, response: Response, next: NextFunction) => {
    const userData = request.body;
    try {
        const user = await this.userService.createNewOrUpdate(userData);
        if (!user) {
            return response.status(404).json({ error: 'User not found or could not be created/updated.' });
        }
        if (userData.password) {
            const hashedPassword = await this.passwordService.hashPassword(userData.password)
            await this.passwordService.createOrUpdate({
                userId: user._id,
                password: hashedPassword
            });
        }
        response.status(200).json(user);
    } catch (error: unknown) {
        console.error(`Validation Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        response.status(400).json({ error: 'Bad request', value: error instanceof Error ? error.message : 'Unknown error' });
    }
 
 };
 
 private removeHashSession = async (request: Request, response: Response, next: NextFunction) => {
    const {userId} = request.params
    try {
        const result = await this.tokenService.remove(userId);
        response.status(200).send(result);
    } catch (error) {
        console.error(`Validation Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        response.status(401).json({error: 'Unauthorized'});
    }
 };

    private resetPassword = async (request: Request, response: Response, next: NextFunction) => {
        const { login, newPassword } = request.body;

        if (!login || !newPassword) {
            return response.status(400).json({ error: 'Brak wymaganych danych: login lub newPassword' });
        }

        try {
            const user = await this.userService.getByEmailOrName(login);
            if (!user) {
                return response.status(404).json({ error: 'Użytkownik nie znaleziony' });
            }

            const hashedPassword = await this.passwordService.hashPassword(newPassword);

            await this.passwordService.createOrUpdate({
                userId: user._id,
                password: hashedPassword,
            });

            response.status(200).json({ message: 'Hasło zostało pomyślnie zresetowane.' });
        } catch (error: unknown) {
            console.error('Błąd podczas resetowania hasła:', error);
            response.status(500).json({ error: 'Wewnętrzny błąd serwera', value: error instanceof Error ? error.message : 'Nieznany błąd' });
        }
    };

    private changePassword = async (request: Request, response: Response, next: NextFunction) => {
        const { userId, currentPassword, newPassword } = request.body;

        if (!userId || !currentPassword || !newPassword) {
            return response.status(400).json({ error: 'Brak wymaganych danych: userId, currentPassword lub newPassword' });
        }

        try {
            const user = await this.userService.getById(userId);
            if (!user) {
                return response.status(404).json({ error: 'Użytkownik nie znaleziony' });
            }

            const isPasswordValid = await this.passwordService.verifyPassword(userId, currentPassword);
            if (!isPasswordValid) {
                return response.status(401).json({ error: 'Niepoprawne aktualne hasło' });
            }

            const hashedPassword = await this.passwordService.hashPassword(newPassword);

            await this.passwordService.createOrUpdate({
                userId: user._id,
                password: hashedPassword,
            });

            response.status(200).json({ message: 'Hasło zostało pomyślnie zmienione.' });
        } catch (error: unknown) {
            console.error('Błąd podczas zmiany hasła:', error);
            response.status(500).json({ error: 'Wewnętrzny błąd serwera', value: error instanceof Error ? error.message : 'Nieznany błąd' });
        }
    };



 


}

export default UserController;