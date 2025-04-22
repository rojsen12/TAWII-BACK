import { Request, Response, Router } from 'express';
import path from 'path';
import Controller from '../interfaces/controller.interface';

class IndexController implements Controller {
    public path = '/home';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.serveIndex);
    }

    private serveIndex = (request: Request, response: Response) => {
        const indexPath = path.resolve(__dirname, '..', 'public', 'index.html');
        response.setHeader('Cache-Control', 'no-store');
        response.sendFile(indexPath);
    }
}

export default IndexController;
