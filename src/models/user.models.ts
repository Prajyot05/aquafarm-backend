import mongoose, { Schema } from 'mongoose'
import { UserType } from '../types/user.types'

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    emailId: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'SUPERADMIN'],
        default: 'ADMIN'
    },
    pond: {
        type: Schema.Types.ObjectId,
        ref: 'Pond'
    }
}, {timestamps: true})

export const User = mongoose.model<UserType>(
    'User',
    UserSchema
)