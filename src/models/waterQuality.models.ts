import mongoose, { Document, Schema } from 'mongoose'

export interface WaterQualityType extends Document {
    tds: number // Total Dissolved Solids (mg/L)
    pH: number // pH level (unitless)
    temperature: number // Temperature (°C)
    orp: number // Oxidation-Reduction Potential (mV)
    recordedAt: Date // Date and time of recording
}

const WaterQualitySchema: Schema = new Schema({
    tds: {
        type: Number,
        required: true,
    },
    pH: {
        type: Number,
        required: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    orp: {
        type: Number,
        required: true,
    },
    recordedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

export default mongoose.model<WaterQualityType>(
    'WaterQuality',
    WaterQualitySchema
)
