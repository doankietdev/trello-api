import express from 'express'
import boardRoute from './boardRoute'
import columnRoute from './columnRoute'
import cardRoute from './cardRoute'
import userRoute from './userRoute'

const router = express.Router()

router.use('/boards', boardRoute)
router.use('/columns', columnRoute)
router.use('/cards', cardRoute)
router.use('/users', userRoute)

export default router
