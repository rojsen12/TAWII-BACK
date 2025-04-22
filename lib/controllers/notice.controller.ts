import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import NoticeService from "../modules/services/notice.service";
import Joi from "joi";


class NoticeController implements Controller {
   public path = '/api/notice';
   public router = Router();
   private dataService: NoticeService;

   constructor() {
       this.initializeRoutes();
       this.dataService = new NoticeService();
   }

   private initializeRoutes() {
       this.router.get(`${this.path}s`, this.getAll);

       this.router.get(`${this.path}/:id`,this.getById)

       this.router.post(`${this.path}/`, this.postNotice);

       this.router.delete(`${this.path}/`,this.deleteAll);
   }

   private getAll = async (request: Request, response: Response, next: NextFunction) => {
       try {
           const allData = await this.dataService.getAll();
           const sortedData = allData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

           response.status(200).json(sortedData);
       } catch (error) {
           console.log('Błąd: ', error)

           response.status(400).json({error: 'Unable to get data.'});
       }
 };

   private getById = async (request: Request, response: Response, next: NextFunction) => {
       try {
           const {id} = request.params;
           const singleNotice = await this.dataService.getById(id);
           response.status(200).json(singleNotice);
       } catch(error){
           console.log('Błąd: ', error)

           response.status(400).json({error: 'Unable to get data.'});
       }

   };


    private postNotice = async (request: Request, response: Response, next: NextFunction) => {
        const {title, text, image,author} = request.body;

        const schema = Joi.object({
            title: Joi.string().required(),
            text: Joi.string().required(),
            image: Joi.string().uri().required(),
            author: Joi.string().required()});

        try {
            const validatedData = await schema.validateAsync({title,text,image,author})
            await this.dataService.createNotice(validatedData);
            response.status(200).json(validatedData);
        } catch (error) {
            console.log('Błąd: ', error)

            response.status(400).json({error: 'Invalid input data.'});
        }
    };

    private deleteAll = async (request: Request,response: Response,next: NextFunction) => {
        try {
            await this.dataService.deleteAllPosts();
            response.status(200).json(["Succesfully deleted"]);
        } catch (error) {
            console.log('Błąd: ', error)

            response.status(400).json({error: 'Unable to delete data.'});
        }
    };
}

export default NoticeController;

