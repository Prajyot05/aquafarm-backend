import express from 'express'
import {
    createWaterQuality,
    getWaterQuality,
} from '../controllers/waterQuality.controllers'

const router = express.Router()

router.post('/', createWaterQuality)
router.get('/', getWaterQuality)

export default router
