import { NextFunction, Request, Response } from 'express'
import { Tray } from '../models/tray.models'
import { Weight } from '../models/weight.models'
import ErrorHandler from '../utils/utility-class'

export const createWeight = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {
        tray,
        emptyTray,
        withFeed,
        withFeedInWater,
        withShrimps,
        leftoverFeed,
    } = req.body

    if (
        !tray ||
        emptyTray == null ||
        withFeed == null ||
        withFeedInWater == null ||
        withShrimps == null ||
        leftoverFeed == null
    ) {
        return next(new ErrorHandler('Kindly fill all required fields', 400))
    }

    try {
        const existingTray = await Tray.findById(tray)
        if (!existingTray) {
            return next(new ErrorHandler('Tray not found', 404))
        }

        const weight = await Weight.create({
            tray,
            emptyTray,
            withFeed,
            withFeedInWater,
            withShrimps,
            leftoverFeed,
        })
        res.status(201).json({
            success: true,
            message: 'Weight recorded successfully',
            weight,
        })
    } catch (error) {
        return next(new ErrorHandler(`Failed to record weight: ${error}`, 500))
    }
}

export const getWeights = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const weights = await Weight.find().populate('tray')
        res.status(200).json({ success: true, data: weights })
    } catch (error) {
        return next(new ErrorHandler(`Failed to fetch weights: ${error}`, 500))
    }
}

export const getWeightsByDate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { date } = req.query
    if (!date) {
        return next(new ErrorHandler('Date query parameter is required', 400))
    }
    try {
        const startDate = new Date(date as string)
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 1)

        const weights = await Weight.find({
            createdAt: { $gte: startDate, $lt: endDate },
        }).populate('tray')
        res.status(200).json({ success: true, data: weights })
    } catch (error) {
        return next(
            new ErrorHandler(`Failed to fetch weights by date: ${error}`, 500)
        )
    }
}
