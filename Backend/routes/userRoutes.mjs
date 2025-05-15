import express from "express"
import tokenVerification from "../middleware/tokenVerification.mjs"
import { signUp, logIn, forget, resetPassword, updateProfile } from "../Controller/userController.mjs"
import { uploadImage } from "../middleware/upload.mjs"
const router = express.Router()

router.post('/signup', signUp)
router.post('/login', logIn)
router.post('/forget', forget)
router.post('/resetpassword/:id/:token', resetPassword)
router.put('/updateprofile', tokenVerification, uploadImage, updateProfile)

export default router
