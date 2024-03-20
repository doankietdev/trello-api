import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import notFoundHandlingMiddleware from './middlewares/notFoundHandlingMiddleware'
import errorHandlingMiddleware from './middlewares/errorHandlingMiddleware'
import { corsOptions } from './configs/cors'
import { route } from './routes'

const app = express()

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(compression())

route(app)

app.use(notFoundHandlingMiddleware)
app.use(errorHandlingMiddleware)

export default app
