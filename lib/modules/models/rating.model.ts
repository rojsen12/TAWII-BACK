import mongoose, { Schema, Document } from "mongoose";

export interface IRating extends Document {
    lessonId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    score: number;
    comment?: string;
    created: Date;
}

const RatingSchema = new Schema<IRating>({
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    created: { type: Date, default: Date.now }
});

export const Rating = mongoose.model<IRating>("Rating", RatingSchema);
