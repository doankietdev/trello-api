import express from 'express'
import boardValidation from '~/validations/boardValidation'

const router = express.Router()

router.get('/')
router.post('/', boardValidation.createNew)

export default router
