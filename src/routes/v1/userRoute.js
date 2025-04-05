import express from 'express'
import userController from '~/controllers/userController'
import authMiddleware from '~/middlewares/authMiddleware'
import userValidation from '~/validations/userValidation'

const router = express.Router()

router.route('/register').post(userValidation.register, userController.register)

router.route('/verify').post(userValidation.verify, userController.verify)

router.route('/login').post(userValidation.login, userController.login)

router.route('/logout').delete(authMiddleware.isAuthorized, userController.logout)

router.route('/refresh-token').get(userController.refreshTokenPair)

export default router
