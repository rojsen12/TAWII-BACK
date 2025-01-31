import { Request, Response, NextFunction, Router, query } from 'express';
import { checkPostCount } from '../middlewares/checkPostCount.middleware';
import DataService from '../modules/services/data.service';
import { Types } from 'mongoose';
import Joi from 'joi';

let testArr = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6, 4, 3, 6, 3, 6];

class PostController {
    public path = '/api/post';
    public router = Router();
    public dataService = new DataService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.post(`${this.path}/:num`, checkPostCount, this.getData);  
        this.router.post(`${this.path}`, this.addDataM);
        this.router.get(`${this.path}/:id`, this.getByIdM);
        this.router.get(`${this.path}`, this.getAllM);
        this.router.delete(`${this.path}`, this.deleteByIdM);
        this.router.delete(`${this.path}s`, this.deleteAllM); 
    }

    private getAll = async (request: Request, response: Response, next: NextFunction) => {
        response.status(200).json(testArr);
    }

    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { elem } = request.body;
        const { id } = request.params;
        const cleanedId = id.replace(':', ''); 
        const index = parseInt(cleanedId); 
        testArr.push(index);
        response.status(200).json(testArr);
    }

    private getById = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params; 
        const cleanedId = id.replace(':', ''); 
        const index = parseInt(cleanedId); 
        console.log(index);

        if (isNaN(index) || index < 0 || index >= testArr.length) {
            return response.status(404).json({ message: 'Element not found' });
        }
        const element = testArr[index]; 
        return response.status(200).json({element});
    }

    private deleteData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const cleanedId = id.replace(':', ''); 
        const index = parseInt(cleanedId);
    
        if (isNaN(index) || index < 0 || index >= testArr.length) {
            return response.status(400).json({ error: 'Invalid index' });
        }

        const deletedElement = testArr.splice(index, 1);

        response.status(200).json({
            deletedElement: deletedElement[0],
            updatedArray: testArr,
        });
    };

    private getData = async (request: Request, response: Response, next: NextFunction) => {
        const { num } = request.params;
        const cleanedNum = num.replace(':', '');
        const count = parseInt(cleanedNum, 10);
    
        if (isNaN(count) || count <= 0) {
            return response.status(400).json({ error: 'Invalid number of elements' });
        }
        const result = testArr.slice(0, count);
    
        response.status(200).json({
            data: result,
        });
    };

    private getAllData = async (request: Request, response: Response, next: NextFunction) => {
        response.status(200).json({data: testArr,});
    };
    
    private deleteAllData = async (request: Request, response: Response, next: NextFunction) => {
        testArr.length = 0;
        response.status(200).json({
            data: testArr, 
        });
    };

    private addDataM = async (request: Request, response: Response, next: NextFunction) => {
        const {title, text, image} = request.body;
     
        const schema = Joi.object({
            title: Joi.string().required(),
            text: Joi.string().required(),
            image: Joi.string().uri().required()
        });
        try {
            const validatedData = await schema.validateAsync({title, text, image});
            await this.dataService.createPost(validatedData);
            response.status(200).json(validatedData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Validation Error: ${error.message}`);
            } else {
                console.error('An unknown error occurred');
            }
            response.status(400).json({ error: 'Invalid input data.' });
        }
     }

    private getByIdM = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const allData = await this.dataService.query({ _id: id });
        response.status(200).json(allData);
    }

    private deleteByIdM = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const allData = await this.dataService.deleteByID({ _id: id });
        response.status(200).json(allData);
    };

    private deleteAllM = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.dataService.deleteAllPosts();
            response.status(204).send();
        } catch (error) {
            next(error);
        }
    };


    private getAllM = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const allData = await this.dataService.getAll();
            response.status(200).json(allData);
        } catch (error) {
            console.log('eeee', error)

            //console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    }

     private getElementById = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const allData = await this.dataService.query({_id: id});
        response.status(200).json(allData);
     }
     
     private removePost = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        await this.dataService.deleteData({_id: id});
        response.sendStatus(200);
     };


    
}

export default PostController;
