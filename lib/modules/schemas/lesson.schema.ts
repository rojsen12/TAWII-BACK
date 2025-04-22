import { Schema, model } from 'mongoose';
import { ILesson } from "../models/lesson.model";

export const LessonSchema: Schema = new Schema({
    author:  { type: String, required: true },
    content:  { type: String, required: true },
    image:  { type: String, required: true },
    created:  { type: Date,required: true, default: Date.now  },
    title: {type: String,required: true },
    subject: {type: String,required: true }
});

export default model<ILesson>('Lekcje', LessonSchema);