import express from 'express'
import columnValidation from '~/validations/columnValidation'
import columnController from '~/controllers/columnController'

const router = express.Router()

router.route('/')
  .post(columnValidation.createNew, columnController.createNew)

router.route('/:id')
  .patch(columnValidation.update, columnController.update)

export default router
