import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.models";
import bcrypt from 'bcryptjs';
import { CreateAdminBody, CustomRequest } from "../types/user.types";
import ErrorHandler from "../utils/utility-class";
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongoose";
import { Pond } from "../models/pond.models";

export const createAdmin = async (req: Request<{}, {}, CreateAdminBody>, res: Response, next: NextFunction) => {
    const { username, password, emailId, phone, pondName, pondAddress } = req.body;

    if (!username || !password || !phone || !pondName || !pondAddress) {
        return next(new ErrorHandler("Kindly fill all required fields", 400));
    }

    try {
        // Check if username already exists
        const userExists = await User.findOne({ username });

        if (userExists) {
            return next(new ErrorHandler("Username already exists", 400));
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the admin
        const user = await User.create({
            username,
            password: hashedPassword,
            emailId: emailId || null,
            phone,
            role: "ADMIN",
        });

        if (!user) {
            return next(new ErrorHandler("Failed to create Admin", 500));
        }

        // Create the pond and associate it with the admin
        const pond = await Pond.create({
            name: pondName,
            address: pondAddress,
            admin: user._id,
        });

        if (!pond) {
            // Clean up the user if pond creation fails
            await User.findByIdAndDelete(user._id);
            return next(new ErrorHandler("Failed to create Pond", 500));
        }

        // Update the user with the pond reference
        user.pond = pond._id;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Successfully created Admin",
        });
    } catch (error) {
        return next(new ErrorHandler(`Failed to create Admin: ${error}`, 400));
    }
};


export const createSuperAdmin = async (req: Request<{}, {}, CreateAdminBody>, res: Response, next: NextFunction) => {
    const { username, password, emailId, phone } = req.body
    console.log(username, password, emailId, phone)

    if(!username || !password || !phone) {
        return next(new ErrorHandler("Kindly fill all required fields", 400));
    }

    try {
        // Check if username already exists
        const userExists = await User.findOne({username})

        if(userExists){
            return next(new ErrorHandler("Username already exists", 400));
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new user
        const user = await User.create({
            username,
            password: hashedPassword,
            emailId: emailId || null,
            phone,
            role: "SUPERADMIN"
        })

        if(!user){
            return next(new ErrorHandler("An error occurred while creating Admin", 500));
        }
        else{
            res.status(200).json({ 
                success: true,
                message: "Successfully created Admin" 
            })
        }
    } catch (error) {
        return next(new ErrorHandler(`Failed to create Admin: ${error}`, 400));
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const {username, password} = req.body
    if(!username || !password){
        return next(new ErrorHandler("Kindly fill all fields", 400));
    }
    try {
        const user = await User.findOne({username})
        // Verify Password
        if(user && (await bcrypt.compare(password, user.password))){

            // Set JWT as an HTTP-only cookie
            res.cookie("token", generateToken(user._id as ObjectId), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict", // Prevent CSRF attacks
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json({
                success: true,
                message: "Login successful"
            })
        }
        else{
            return next(new ErrorHandler("Invalid Credentials", 400));   
        }
    } catch (error) {
        return next(new ErrorHandler(`Failed to login: ${error}`, 400));
    }
}

export const getAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user!.id).select("-password")
        console.log('USER: ', user)

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        res.status(200).json({
            success: true,
            data: {
                user
            }
        })
    } catch (error) {
        return next(new ErrorHandler(`Failed to get Admin: ${error}`, 400));
    }
}


export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(0), // Expire the cookie
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(new ErrorHandler(`Failed to log out: ${error}`, 500));
    }
};

// Generate JWT
const generateToken = (id: ObjectId): string => {
    return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};