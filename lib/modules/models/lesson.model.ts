import {IRating} from "./rating.model";

export interface ILesson {
    author: string;
    content: string;
    image: string;
    created: Date;
    title: string;
    ratings?: IRating[];
    subject: string;
}
