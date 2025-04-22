import { Request, Response, NextFunction, Router, query } from 'express';
import { checkPostCount } from '../middlewares/checkPostCount.middleware';
import DataService from '../modules/services/data.service';
import { Types } from 'mongoose';
import { Rating} from "../modules/models/rating.model";
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
        this.router.post(`${this.path}/:lessonId/rate`, this.addRatingM);
        this.router.get(`${this.path}/:lessonId/rating`, this.getAverageRatingM);
        this.router.get(`${this.path}/:lessonId/check`, this.checkRatingExists);
        this.router.get(`${this.path}/:lessonId/fgdfgfdgfddfg/user/:userId`, this.getRatingByUserAndLesson);
    }

    private addRatingM = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { lessonId } = request.params;
            const { userId, score, comment } = request.body;

            if (!lessonId || !userId || !score || score < 1 || score > 5) {
                return response.status(400).json({ message: 'Nieprawidłowe dane oceny' });
            }

            const existingRating = await Rating.findOne({ lessonId, userId });
            if (existingRating) {
                return response.status(400).json({ message: 'Już oceniłeś tę lekcję' });
            }

            const rating = new Rating({
                lessonId,
                userId,
                score,
                comment
            });

            await rating.save();
            response.status(201).json({ message: 'Ocena zapisana!', rating });
        } catch (error) {
            response.status(500).json({ message: 'Błąd serwera', error });
        }
    };

    private getRatingByUserAndLesson = async (request: Request, response: Response, next: NextFunction) => {
        console.log("dgdffdgfdgdfgdfdfg");
        try {
            const { lessonId } = request.params;
            const { userId } = request.params;

            if (!lessonId || !userId) {
                return response.status(400).json({ message: 'Brak wymaganych parametrów' });
            }

            console.log(`Szukam oceny dla lekcji: ${lessonId}, użytkownik: ${userId}`);

            const rating = await Rating.findOne({ lessonId, userId: userId.toString() });

            if (rating) {
                const ratingResponse: any = {
                    score: rating.score,
                    comment: rating.comment
                };

                return response.status(200).json({
                    found: true,
                    rating: ratingResponse
                });
            } else {
                return response.status(200).json({
                    found: false,
                    message: 'Nie znaleziono oceny dla tego użytkownika i lekcji'
                });
            }
        } catch (error) {
            console.error('Błąd podczas pobierania oceny:', error);
            response.status(500).json({ message: 'Błąd serwera', error });
        }
    };

    private checkRatingExists = async (request: Request, response: Response, next: NextFunction) => {
        console.log('checkRatingExists called', request.params, request.query);
        try {
            const { lessonId } = request.params;
            const { userId } = request.query;

            if (!lessonId || !userId) {
                return response.status(400).json({ message: 'Brak wymaganych parametrów' });
            }

            const existingRating = await Rating.findOne({ lessonId, userId: userId.toString() });

            if (existingRating) {
                return response.status(200).json({
                    exists: true,
                    rating: existingRating
                });
            } else {
                return response.status(200).json({
                    exists: false
                });
            }
        } catch (error) {
            response.status(500).json({ message: 'Błąd serwera', error });
        }
    };
    async getAverageRatingM(req: Request, res: Response) {
        try {
            console.log("Żądanie do /api/post/:lessonId/rating");
            const { lessonId } = req.params;
            console.log("Otrzymane lessonId:", lessonId);

            const ratings = await Rating.find({ lessonId });

            if (!ratings.length) {
                console.log("Brak ocen w bazie");
                return res.status(404).json({ message: "Brak ocen dla tej lekcji" });
            }

            const averageRating = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
            console.log("Średnia ocena:", averageRating);

            res.json({ averageRating });
        } catch (error) {
            console.error("Błąd pobierania oceny:", error);
            res.status(500).json({ message: "Błąd serwera" });
        }
    }

}

export default PostController;
