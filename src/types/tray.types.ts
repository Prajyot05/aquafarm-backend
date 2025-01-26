import { Document, ObjectId } from 'mongoose'

export interface TrayType extends Document {
    name: string
    pond: ObjectId
    images: string[]
}
