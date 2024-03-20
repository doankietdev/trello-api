import express from 'express'
import boardValidation from '~/validations/boardValidation'
import boardController from '~/controllers/boardController'

const router = express.Router()

router.route('/')
  .get(boardController.getAll)
  .post(boardValidation.createNew, boardController.createNew)

router.route('/:id')
  .get(boardController.getDetails)
  .patch(boardValidation.update, boardController.update)
  .delete(boardValidation.deleteBoard, boardController.deleteBoard)

export default router
