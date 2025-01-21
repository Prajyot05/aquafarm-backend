import express from 'express'
import { createAdmin, createHandler, createSuperAdmin, getAdmin, loginUser, logoutUser } from '../controllers/user.controllers'
import { authorizeAdmin, authorizeHandler, authorizeNoone, authorizeSuperAdmin } from '../middlewares/auth.middlewares'
import { upload } from '../utils/multer'
import { getImages, uploadImages } from '../controllers/pond.controllers'

// /api/v1/user...
const router = express.Router()

router.post('/login', loginUser)
router.post('/logout', logoutUser)

// Create Admin
router.post('/admin/create', authorizeSuperAdmin, createAdmin)

// Get Admin
router.get('/admin', authorizeAdmin, getAdmin)

// Create SuperAdmin
router.post('/superadmin/create', authorizeNoone, createSuperAdmin)

// Create Handler
router.post('/handler/create', authorizeAdmin, createHandler)

// Upload Images
router.post('/handler/upload', upload, authorizeHandler, uploadImages)

// Get Images
router.get('/pond/images', authorizeHandler, getImages)

export default router