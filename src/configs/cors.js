import { StatusCodes } from 'http-status-codes'
import { APP, BUILD_MODE } from './environment'
import { DEV_ENV } from '~/utils/constants'
import ApiError from '~/utils/ApiError'

export const corsOptions = {
  origin: async function (origin, callback) {
    if (BUILD_MODE === DEV_ENV) {
      return callback(null, true)
    }
    const isValidDomain = APP.WHITE_LIST_DOMAINS.includes(origin)
    if (isValidDomain) {
      return callback(null, true)
    }
    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy`))
  },
  optionsSuccessStatus: 200,
  credentials: true
}
