import * as mongodb from "mongodb";

export interface Product {
    name: string;
    desc: string;
    l_desc: string;
    category: string;
    position: number;
    price: number;
    available: boolean;
    img: string;
    imgs: [string];
    _id?: mongodb.ObjectId;
}