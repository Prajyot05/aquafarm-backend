import { Request, Response } from 'express'
import WaterQualityModel from '../models/waterQuality.models'
import { getErrorMessage } from '../utils/features'
import { WaterQualityRequestBody } from '../types/waterQuality.types'

export const createWaterQuality = async (req: Request, res: Response) => {
    try {
        const { tds, pH, temperature, orp, recordedAt } =
            req.body as WaterQualityRequestBody

        const newRecord = await WaterQualityModel.create({
            tds,
            pH,
            temperature,
            orp,
            recordedAt,
        })

        res.status(201).json({
            success: true,
            data: newRecord,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: getErrorMessage(error),
        })
    }
}

export const getWaterQuality = async (req: Request, res: Response) => {
    try {
        const records = await WaterQualityModel.find()

        res.status(200).json({
            success: true,
            data: records,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: getErrorMessage(error),
        })
    }
}
