import express from 'express'
import {
    createWeight,
    getWeights,
    getWeightsByDate,
} from '../controllers/weight.controllers'

const router = express.Router()

router.post('/', createWeight)
router.get('/', getWeights)
router.get('/by-date', getWeightsByDate)

export default router
