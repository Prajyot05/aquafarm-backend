import jwt from 'jsonwebtoken'
import { User } from '../models/user.models'
import { NextFunction, Response } from 'express'
import ErrorHandler from '../utils/utility-class'
import { CustomRequest, RequestUser } from '../types/user.types'

export const authorizeAdmin = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    let token
    if (req.cookies && req.cookies.token) {
        try {
            token = req.cookies.token

            const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
                id: string
            }

            // Get user from token
            const user = await User.findById(decoded.id).select('-password')

            if (
                !user ||
                (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')
            ) {
                res.status(401).json({
                    message: 'Not authorized, user not found',
                })
                return
            }

            // Map user document to RequestUser type
            const mappedUser: RequestUser = {
                id: user._id.toString(),
                username: user.username,
                emailId: user.emailId,
                phone: user.phone,
                role: user.role,
            }

            req.user = mappedUser

            next()
        } catch (error) {
            return next(
                new ErrorHandler(`Failed to authenticate: ${error}`, 401)
            )
        }
    }

    if (!token) {
        return next(
            new ErrorHandler('Not authorized to access this route', 401)
        )
    }
}

export const authorizeSuperAdmin = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    let token
    if (req.cookies && req.cookies.token) {
        try {
            token = req.cookies.token

            const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
                id: string
            }

            const user = await User.findById(decoded.id).select('-password')

            if (!user || user.role !== 'SUPERADMIN') {
                return next(
                    new ErrorHandler('Not authorized, user not found', 401)
                )
            }

            const mappedUser: RequestUser = {
                id: user._id.toString(),
                username: user.username,
                emailId: user.emailId,
                phone: user.phone,
                role: user.role,
            }

            req.user = mappedUser

            next()
        } catch (error) {
            return next(
                new ErrorHandler(`Failed to authenticate: ${error}`, 401)
            )
        }
    }

    if (!token) {
        return next(
            new ErrorHandler('Not authorized to access this route', 401)
        )
    }
}

export const authorizeNoone = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    return next(new ErrorHandler('Not authorized to access this route', 401))
}
