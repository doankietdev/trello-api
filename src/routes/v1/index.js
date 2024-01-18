import express from 'express'
import boardRoute from './boardRoute'
import columnRoute from './columnRoute'

const router = express.Router()

router.use('/boards', boardRoute)
router.use('/columns', columnRoute)

export default router
