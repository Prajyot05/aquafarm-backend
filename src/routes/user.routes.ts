import express from 'express'
import { createAdmin, createSuperAdmin, getAdmin, loginUser } from '../controllers/user.controllers'
import { authorizeAdmin, authorizeNoone, authorizeSuperAdmin } from '../middlewares/auth.middlewares'

// /api/v1/user...
const router = express.Router()

router.post('/login', loginUser)

// Admin Routes
router.post('/admin/create', authorizeSuperAdmin, createAdmin)
router.get('/admin', authorizeAdmin, getAdmin)

// SuperAdmin Routes
router.post('/superadmin/create', authorizeNoone, createSuperAdmin)

export default router