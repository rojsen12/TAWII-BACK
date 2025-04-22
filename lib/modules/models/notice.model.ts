export interface INotice {
    title: string;
    text: string;
    image: string;
    author: string;
    date: Date;
}

export type Query<T> = {
    [key: string]: T;
};