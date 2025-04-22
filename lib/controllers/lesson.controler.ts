import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import LessonService from "../modules/services/lesson.service";
import Joi from "joi";


class LessonController implements Controller {
    public path = '/api/lesson';
    public router = Router();
    private dataService: LessonService;

    constructor() {
        this.initializeRoutes();
        this.dataService = new LessonService();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}s`, this.getAll);

        this.router.get(`${this.path}/:id`, this.getOne);

        this.router.post(`${this.path}`, this.addLesson);

        this.router.delete(`${this.path}`,this.deleteAll);
    }

    private getAll = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const allData = await this.dataService.getAll();
            const sortedData = allData.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());


            response.status(200).json(sortedData);
        } catch (error) {
            console.log('Błąd: ', error)

            response.status(400).json({error: 'Unable to get data.'});
        }
    };

    private addLesson = async (request: Request, response: Response, next: NextFunction) => {
        const {title, content, image,author,subject} = request.body;

        const schema = Joi.object({
            author: Joi.string().required(),
            content: Joi.string().required(),
            image: Joi.string().uri().required(),
            title: Joi.string().required(),
            subject: Joi.string().required()
        });

        try {
            const validatedData = await schema.validateAsync({title,content,image,author,subject})
            await this.dataService.createLesson(validatedData);
            response.status(200).json(validatedData);
        } catch (error) {
            console.log('Błąd: ', error)

            response.status(400).json({error: 'Invalid input data.'});
        }
    }

    private deleteAll = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.dataService.deleteAllPosts()
            response.status(200).json('Data cleared');
        } catch (e) {
            console.error(e)
        }
    }

    private getOne  = async (request: Request, response: Response, next: NextFunction) => {
        const {id} = request.params;

        try {
            const singleLesson = await this.dataService.getById(id);
            response.status(200).json(singleLesson);
        } catch (error) {
            console.log('Błąd: ', error)

            response.status(400).json({error: 'Unable to get data.'});
        }
    };
}

export default LessonController;