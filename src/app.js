import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import requestIp from 'request-ip'
import { corsOptions } from './configs/cors'
import errorHandlingMiddleware from './middlewares/errorHandlingMiddleware'
import notFoundHandlingMiddleware from './middlewares/notFoundHandlingMiddleware'
import { route } from './routes'

const app = express()

app.use(cors(corsOptions))
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(cookieParser())
app.use(helmet())
app.use(compression())
app.set('trust proxy', 1)
app.use(requestIp.mw())

route(app)

app.use(notFoundHandlingMiddleware)
app.use(errorHandlingMiddleware)

export default app
