import express from 'express'
import boardValidation from '~/validations/boardValidation'
import boardController from '~/controllers/boardController'

const router = express.Router()

router.route('/')
  .get()
  .post(boardValidation.createNew, boardController.createNew)

router.route('/:id')
  .get(boardController.getDetails)

export default router
