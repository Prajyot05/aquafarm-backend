import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'
import ErrorHandler from '../utils/utility-class'
import { Pond } from '../models/pond.models'
import { Tray } from '../models/tray.models'
import { ObjectId } from 'mongoose'
import { PondType } from '../types/pond.types'

// Directory where images are stored
const CAPTURES_DIR = path.join(__dirname, '../../captures')

// Ensure the folder exists
if (!fs.existsSync(CAPTURES_DIR)) {
    fs.mkdirSync(CAPTURES_DIR, { recursive: true })
}

/**
 * Add a tray to a pond.
 */
export const addTray = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { pondName, trayName } = req.body

        if (!pondName || !trayName) {
            return next(
                new ErrorHandler('Pond ID and Tray name are required', 400)
            )
        }

        const pond = await Pond.findOne({ name: pondName })
        if (!pond) {
            return next(new ErrorHandler('Pond not found', 404))
        }

        const tray = await Tray.create({ name: trayName, pond: pond._id })
        pond.trays.push(tray._id as ObjectId)
        await pond.save()

        res.status(201).json({ success: true, tray })
    } catch (error: any) {
        next(new ErrorHandler(error.message, 500))
    }
}

/**
 * Update tray name.
 */
export const updateTray = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { trayName, newName } = req.body

        if (!trayName || !newName) {
            return next(
                new ErrorHandler('Tray ID and new name are required', 400)
            )
        }

        const tray = await Tray.findOneAndUpdate(
            { name: trayName },
            { name: newName },
            { new: true }
        )
        if (!tray) {
            return next(new ErrorHandler('Tray not found', 404))
        }

        res.status(200).json({ success: true, tray })
    } catch (error: any) {
        next(new ErrorHandler(error.message, 500))
    }
}

/**
 * Delete a tray.
 */
export const deleteTray = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { trayName } = req.body

        const tray = await Tray.findOneAndDelete({ name: trayName }).populate<{
            pond: PondType
        }>('pond')
        if (!tray) {
            return next(new ErrorHandler('Tray not found', 404))
        }

        // Remove the tray reference from the associated pond
        await Pond.findByIdAndUpdate(tray.pond, { $pull: { trays: tray._id } })

        // Construct the tray folder path
        const hyphenifiedPondName = tray.pond.name.replace(/\s+/g, '-')
        const hyphenifiedTrayName = tray.name.replace(/\s+/g, '-')
        const trayFolder = path.join(
            CAPTURES_DIR,
            hyphenifiedPondName,
            hyphenifiedTrayName
        )

        // Check if the folder exists and delete it
        if (fs.existsSync(trayFolder)) {
            fs.rmSync(trayFolder, { recursive: true, force: true }) // Recursively delete the folder
            console.log(`Deleted folder: ${trayFolder}`)
        } else {
            console.warn(`Folder not found: ${trayFolder}`)
        }

        res.status(200).json({
            success: true,
            message: 'Tray deleted successfully',
        })
    } catch (error: any) {
        next(new ErrorHandler(error.message, 500))
    }
}

/**
 * Fetch trays for a pond.
 */
export const getTraysForPond = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { pondId } = req.params
        if (!pondId) {
            return next(new ErrorHandler('Pond ID is required', 404))
        }

        const pond = await Pond.findById(pondId).populate('trays')
        if (!pond) {
            return next(new ErrorHandler('Pond not found', 404))
        }

        res.status(200).json({ success: true, trays: pond.trays })
    } catch (error: any) {
        next(new ErrorHandler(error.message, 500))
    }
}

/**
 * Fetch all ponds with associated trays.
 */
export const getPonds = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const ponds = await Pond.find().populate('trays admin')

        res.status(200).json({ success: true, ponds })
    } catch (error: any) {
        next(new ErrorHandler(error.message, 500))
    }
}

/**
 * Upload images for a specific tray.
 * Example of image link: http://localhost:3000/captures/defName/def-tray-1/2025-01-27T14-02-40-381Z/RandomPic.jpg
 */
export const uploadImages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Using trayId would be better
        const { trayName } = req.body

        if (!trayName) {
            return next(new ErrorHandler('Tray Name is required', 400))
        }

        const tray = await Tray.findOne({ name: trayName }).populate<{
            pond: PondType
        }>('pond')

        if (!tray || !tray.pond) {
            return next(new ErrorHandler('Tray or Pond not found', 404))
        }

        // Hyphenify tray names (replace spaces with hyphens)
        const hyphenifiedPondName = tray.pond.name.replace(/\s+/g, '-')
        const hyphenifiedTrayName = tray.name.replace(/\s+/g, '-')

        const pondFolder = path.join(CAPTURES_DIR, hyphenifiedPondName)
        const trayFolder = path.join(pondFolder, hyphenifiedTrayName)

        if (!fs.existsSync(pondFolder)) {
            fs.mkdirSync(pondFolder, { recursive: true })
        }
        if (!fs.existsSync(trayFolder)) {
            fs.mkdirSync(trayFolder, { recursive: true })
        }

        // Create a timestamped subfolder
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const subfolder = path.join(trayFolder, timestamp)
        fs.mkdirSync(subfolder, { recursive: true })

        const uploadedFiles = (req.files as Express.Multer.File[]) || []
        if (uploadedFiles.length === 0) {
            return next(new ErrorHandler('No files uploaded', 400))
        }

        const filePaths: string[] = [] // Array to store in DB

        // Save uploaded files
        uploadedFiles.forEach((file) => {
            const targetPath = path.join(subfolder, file.originalname)
            fs.writeFileSync(targetPath, file.buffer)
            filePaths.push(path.relative(CAPTURES_DIR, targetPath)) // Save relative path
        })

        // Update the tray with the image paths
        tray.images.push(...filePaths)
        await tray.save()

        res.status(200).json({
            success: true,
            message: 'Images uploaded successfully',
            images: filePaths,
        })
    } catch (error: any) {
        next(new ErrorHandler(`Failed to upload images: ${error.message}`, 500))
    }
}
