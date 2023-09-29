import mongoose from "mongoose";
import { ICartProduct } from "./ICart";

export interface IOrder{
    products: ICartProduct[];
    tax: number;
    total: number;
    grandTotal: number;
    paymentType: string;
    orderStatus?: string;
    orderBy: mongoose.Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}  