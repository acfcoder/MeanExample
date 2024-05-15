import * as mongodb from "mongodb";

export interface Category {
    name: string;
    position: number;
    img: string;
    showed: boolean;
    _id?: mongodb.ObjectId;
}