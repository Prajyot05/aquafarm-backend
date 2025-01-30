import express from 'express'
import {
    createAdmin,
    createHandler,
    createSuperAdmin,
    getAdmin,
    loginUser,
    logoutUser,
} from '../controllers/user.controllers'
import {
    authorizeNoone,
    authorizeSuperAdmin,
} from '../middlewares/auth.middlewares'
import { upload } from '../utils/multer'
import {
    addTray,
    deleteTray,
    getPonds,
    getTraysForPond,
    updateTray,
    uploadImages,
} from '../controllers/pond.controllers'

// /api/v1/user...
const router = express.Router()

router.post('/login', loginUser)
router.post('/logout', logoutUser)

// Create Admin
router.post('/admin/create', authorizeSuperAdmin, createAdmin)

// Get Admin
router.get('/admin', getAdmin)

// Create SuperAdmin
router.post('/superadmin/create', authorizeNoone, createSuperAdmin)

// Create Handler
router.post('/handler/create', createHandler)

// Upload Images
router.post('/handler/upload', upload, uploadImages)

// Get Trays for a Pond
router.get('/pond/trays/:pondId', getTraysForPond)

// Get All Ponds
router.get('/ponds', getPonds)

// Add Tray to a Pond
router.post('/pond/tray/add', addTray)

// Update Tray Name
router.post('/pond/tray/update', updateTray)

// Delete Tray
router.delete('/pond/tray/delete', deleteTray)

export default router
