import { Request } from "express";
import mongoose, { ObjectId } from "mongoose";

export interface CreateAdminBody {
    username: string;
    password: string;
    emailId?: string;
    phone: string;
    pondName: string;
    pondAddress: string;
}

export interface UserType extends Document {
    _id: ObjectId;
    username: string;
    password: string;
    emailId?: string;
    phone: string;
    role: 'ADMIN' | 'SUPERADMIN' | 'HANDLER';
    pond?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RequestUser {
    id: string;
    username: string;
    emailId?: string;
    phone: string;
    role: 'ADMIN' | 'SUPERADMIN' | 'HANDLER';
}

export interface CustomRequest extends Request {
    user?: RequestUser;
}
