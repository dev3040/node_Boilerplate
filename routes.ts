import express from 'express'
import UserController from './controller'
const router = express.Router();
import verifyToken from './middleware/auth'

router.post('/register',UserController.register)
router.post('/login',UserController.login)
router.post('/forgotPassword', UserController.forgotPassword)
router.post('/resetPassword', UserController.resetPassword)
router.get('/getUser',verifyToken, UserController.getUser)
router.put('/updateUser',verifyToken,UserController.updateUser)
export default router;