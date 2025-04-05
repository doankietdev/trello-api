import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
import userService from '~/services/userService'
import { COOKIE_KEYS } from '~/utils/constants'
import { AUTH } from '~/configs/environment'

const register = asyncHandler(async (req, res) => {
  const { registeredEmail } = await userService.register(req.body)

  new SuccessResponse({
    statusCode: StatusCodes.CREATED,
    message: ReasonPhrases.CREATED,
    metadata: {
      registeredEmail
    }
  }).send(res)
})

const verify = asyncHandler(async (req, res) => {
  const { verifiedEmail } = await userService.verify(req.body)

  new SuccessResponse({
    message: 'Account verified successfully',
    metadata: {
      verifiedEmail
    }
  }).send(res)
})

const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, ...user } = await userService.login(req.body, req.clientIp)

  res.cookie(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
    maxAge: AUTH.ACCESS_TOKEN_LIFE,
    httpOnly: true,
    secure: true
  })
  res.cookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
    maxAge: AUTH.REFRESH_TOKEN_LIFE,
    httpOnly: true,
    secure: true
  })

  new SuccessResponse({
    message: 'Login successfully',
    metadata: user
  }).send(res)
})

const logout = asyncHandler(async (req, res) => {
  const { jti, sub } = req.auth || {}

  await userService.logout({ jti, userId: sub })

  res.clearCookie(COOKIE_KEYS.ACCESS_TOKEN)
  res.clearCookie(COOKIE_KEYS.REFRESH_TOKEN)

  new SuccessResponse({
    message: 'Logout successfully'
  }).send(res)
})

const refreshTokenPair = asyncHandler(async (req, res) => {
  const { newAccessToken, newRefreshToken } = await userService.refreshTokenPair({
    refreshToken: req.cookies[COOKIE_KEYS.REFRESH_TOKEN],
    ip: req.clientIp
  })

  res.cookie(COOKIE_KEYS.ACCESS_TOKEN, newAccessToken, {
    maxAge: AUTH.ACCESS_TOKEN_LIFE,
    httpOnly: true,
    secure: true
  })
  res.cookie(COOKIE_KEYS.REFRESH_TOKEN, newRefreshToken, {
    maxAge: AUTH.REFRESH_TOKEN_LIFE,
    httpOnly: true,
    secure: true
  })

  new SuccessResponse({
    message: 'Refresh token successfully'
  }).send(res)
})

export default {
  register,
  verify,
  login,
  logout,
  refreshTokenPair
}
