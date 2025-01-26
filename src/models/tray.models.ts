import mongoose, { Schema } from 'mongoose'
import { TrayType } from '../types/tray.types'

const TraySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    pond: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pond',
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
})

export const Tray = mongoose.model<TrayType>('Tray', TraySchema)
