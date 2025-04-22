import { Request, Response } from "express";
import { Rating} from "../modules/models/rating.model";

export const addRating = async (req: Request, res: Response) => {
    try {
        const { lessonId, userId, score, comment } = req.body;

        const existingRating = await Rating.findOne({ lessonId, userId });
        if (existingRating) {
            return res.status(400).json({ message: "Już oceniłeś tę lekcję" });
        }

        const rating = new Rating({ lessonId, userId, score, comment });
        await rating.save();
        res.status(201).json(rating);
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera", error });
    }
};

export const getAverageRating = async (req: Request, res: Response) => {
    try {
        const { lessonId } = req.params;
        const ratings = await Rating.find({ lessonId });

        if (ratings.length === 0) {
            return res.json({ average: 0 });
        }

        const average = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
        res.json({ average: average.toFixed(1), totalRatings: ratings.length });
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera", error });
    }
};
