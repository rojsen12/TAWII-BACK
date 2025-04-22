import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import UserService from "../modules/services/user.service";
import TokenService from "../modules/services/token.service";

class UserController implements Controller {
    public path = '/user';
    public router = Router();
    private dataService: UserService;
    private tokenService: TokenService;

    constructor() {
        this.initializeRoutes();
        this.dataService = new UserService();
        this.tokenService = new TokenService();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, this.login);
        this.router.post(`${this.path}/create`, this.createUser);
    }

    private login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            const user = await this.dataService.login(email, password);

            if (user) {
                const token = await this.tokenService.create(user);
                const userData = await this.dataService.getByEmailOrName(email); // Get user by email or name

                if (userData) {
                    res.status(200).json({
                        token: this.tokenService.getToken(token),
                        name: userData.name,
                        _id: userData._id
                    });
                } else {
                    res.status(404).json({ message: "User not found" });
                }
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } catch (e) {
            console.error("Login Error: ", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    private createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, name, password } = req.body;

            const user = await this.dataService.createNewUser(email, name, password);
            if (user) {
                res.status(200).json({ user });
            } else {
                res.status(401).json({ message: "Error while creating user" });
            }
        } catch (e) {
            console.error("Creating User Error: ", e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default UserController;
