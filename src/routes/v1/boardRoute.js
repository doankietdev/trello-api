import express from 'express'
import boardValidation from '~/validations/boardValidation'
import boardController from '~/controllers/boardController'

const router = express.Router()

router.get('/')
router.post('/', boardValidation.createNew, boardController.createNew)

export default router
