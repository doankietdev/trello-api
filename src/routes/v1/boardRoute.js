import express from 'express'
import boardValidation from '~/validations/boardValidation'
import boardController from '~/controllers/boardController'
import authMiddleware from '~/middlewares/authMiddleware'

const router = express.Router()

router.route('/')
  .get(authMiddleware.isAuthorized, boardController.getAll)
  .post(authMiddleware.isAuthorized, boardValidation.createNew, boardController.createNew)

router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .patch(authMiddleware.isAuthorized, boardValidation.update, boardController.update)
  .delete(authMiddleware.isAuthorized, boardValidation.deleteBoard, boardController.deleteBoard)

export default router
