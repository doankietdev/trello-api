import express from 'express'
import boardRoute from './boardRoute'
import columnRoute from './columnRoute'
import cardRoute from './cardRoute'

const router = express.Router()

router.use('/boards', boardRoute)
router.use('/columns', columnRoute)
router.use('/cards', cardRoute)

export default router
