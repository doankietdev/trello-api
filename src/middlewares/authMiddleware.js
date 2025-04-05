import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { TokenExpiredError } from 'jsonwebtoken'
import authHelper from '~/helpers/authHelper'
import sessionRepo from '~/repositories/sessionRepo'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'
import { COOKIE_KEYS } from '~/utils/constants'

const isAuthorized = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies[COOKIE_KEYS.ACCESS_TOKEN]
  if (!accessToken) throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)

  const decoded = authHelper.decodeToken(accessToken)
  const foundSession = await sessionRepo.findOneByJtiAndUserId({
    jti: decoded.jti,
    userId: decoded.sub
  })
  if (!foundSession) throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
  if (foundSession.ip !== req.clientIp) {
    // Notify warning security
    throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
  }

  let payload = null
  try {
    payload = authHelper.verifyToken(accessToken, foundSession.publicKey)
  } catch (error) {
    if (error instanceof TokenExpiredError)
      throw new ApiError(StatusCodes.GONE, 'Expired access token')
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid access token')
  }
  if (!payload) throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)

  req.auth = { jti: payload.jti, sub: payload.sub }
  next()
})

export default {
  isAuthorized
}
