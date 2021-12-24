import express from 'express'
import UserController from './controller'
const router = express.Router();
import verifyToken from './middleware/auth'

router.post('/register',UserController.register)
router.post('/login',UserController.login)
router.get('/getUser',verifyToken, UserController.getUser)
export default router;