import mongoose from "mongoose";

export interface ICartProduct{
    product: mongoose.Schema.Types.ObjectId;
    count: number;
    price: string;
}

export interface ICart{
    products: ICartProduct[];
    total: number;
    tax: number;
    grandTotal: number;
    userObj: mongoose.Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}