import mongoose, { Schema } from 'mongoose'
import { PondType } from '../types/pond.types'

const PondSchema: Schema = new Schema({
    name: {
        type: String,
        required: true 
    },
    address: {
        type: String,
        required: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const Pond = mongoose.model<PondType>(
    'Pond',
    PondSchema
)