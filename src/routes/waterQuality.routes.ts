import express from 'express'
import {
    createWaterQuality,
    getWaterQuality,
} from '../controllers/waterQuality.controllers'

// api/v1/water-quality...
const router = express.Router()

router.post('/', createWaterQuality)
router.get('/', getWaterQuality)

export default router
