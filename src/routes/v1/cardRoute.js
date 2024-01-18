import express from 'express'
import cardValidation from '~/validations/cardValidation'
import cardController from '~/controllers/cardController'

const router = express.Router()

router.route('/')
  .post(cardValidation.createNew, cardController.createNew)

export default router
