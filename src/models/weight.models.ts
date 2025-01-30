import mongoose, { Schema } from 'mongoose'
import { WeightType } from '../types/weight.types'

const WeightSchema: Schema = new Schema(
    {
        tray: {
            type: Schema.Types.ObjectId,
            ref: 'Tray',
            required: true,
        },
        emptyTray: {
            type: Number,
            required: true,
        },
        withFeed: {
            type: Number,
            required: true,
        },
        withFeedInWater: {
            type: Number,
            required: true,
        },
        withShrimps: {
            type: Number,
            required: true,
        },
        leftoverFeed: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
)

export const Weight = mongoose.model<WeightType>('Weight', WeightSchema)
