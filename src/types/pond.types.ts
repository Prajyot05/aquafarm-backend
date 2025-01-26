import { ObjectId } from 'mongoose'

export interface PondType extends Document {
    name: string
    address: string
    admin: ObjectId
    trays: ObjectId[]
}
