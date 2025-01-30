import mongoose from 'mongoose'

export interface WeightType extends Document {
    tray: mongoose.Schema.Types.ObjectId
    emptyTray: number
    withFeed: number
    withFeedInWater: number
    withShrimps: number
    leftoverFeed: number
}
