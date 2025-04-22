import { Schema, model } from 'mongoose';
import { INotice } from "../models/notice.model";

export const NoticeSchema: Schema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: true },
    author: {type: String, required: true},
    date: {type: Date,required: true,default: Date.now}
});

export default model<INotice>('Korepetycje', NoticeSchema);