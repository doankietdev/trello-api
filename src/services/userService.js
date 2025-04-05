import bcrypt from 'bcryptjs'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { APP } from '~/configs/environment'
import authHelper from '~/helpers/authHelper'
import { pickUser } from '~/helpers/userHelper'
import brevoProvider from '~/providers/brevoProvider'
import sessionRepo from '~/repositories/sessionRepo'
import userRepo from '~/repositories/userRepo'
import ApiError from '~/utils/ApiError'

const register = async (reqBody) => {
  const { email, password } = reqBody

  const foundUser = await userRepo.findOneByEmail(email)
  if (foundUser) throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')

  const username = email.split('@')[0]
  const userData = {
    email,
    password: bcrypt.hashSync(password, 10),
    username,
    displayName: username,
    verifyToken: uuidv4()
  }
  const createResult = await userRepo.createNew(userData)
  const newUser = await userRepo.findOneById(createResult.insertedId)

  const verificationLink = `${APP.WEBSITE_DOMAIN}/account/verification?email=${newUser.email}&token=${newUser.verifyToken}`

  const subject = 'Please verify your email before using our services!'
  const htmlContent = `
    <h3>Here is your verification link:</h3>
    <h3>${verificationLink}</h3>
    <h3>Sincerely,<br/> - Trello - </h3>
  `
  await brevoProvider.sendEmail(newUser.email, subject, htmlContent)

  return {
    registeredEmail: newUser.email
  }
}

const verify = async (reqBody) => {
  const { email, token } = reqBody

  const foundUser = await userRepo.findOneByEmail(email)
  if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
  if (token !== foundUser.verifyToken) throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid token')

  const updatedUser = await userRepo.update(foundUser._id, {
    verifyToken: null,
    isActive: true
  })

  return {
    verifiedEmail: updatedUser.email
  }
}

const login = async (reqBody, ip) => {
  const { email, password } = reqBody

  const foundUser = await userRepo.findOneByEmail(email)
  if (!foundUser) throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect email or password')
  if (!bcrypt.compareSync(password, foundUser.password))
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect email or password')
  if (!foundUser.isActive) throw new ApiError(StatusCodes.BAD_REQUEST, 'Account not activated')

  const { publicKey, privateKey } = await authHelper.generateKeyPairRSA()
  const jti = uuidv4()
  const accessToken = await authHelper.generateAccessToken(
    { jti, sub: foundUser._id.toString() },
    privateKey
  )
  const refreshToken = await authHelper.generateRefreshToken(
    { jti, sub: foundUser._id.toString() },
    privateKey
  )

  await sessionRepo.createNew({
    jti,
    publicKey,
    ip,
    userId: foundUser._id.toString()
  })

  return { accessToken, refreshToken, ...pickUser(foundUser) }
}

const logout = async ({ jti, userId }) => {
  const isSuccess = await sessionRepo.deleteByJtiAndUserId({ jti, userId })
  if (!isSuccess) throw new ApiError(StatusCodes.BAD_REQUEST, 'Logout failed')
}

const refreshTokenPair = async ({ refreshToken, ip }) => {
  const decoded = authHelper.decodeToken(refreshToken)
  if (!decoded) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
  const foundSession = await sessionRepo.findOneByJtiAndUserId({
    jti: decoded.jti,
    userId: decoded.sub
  })
  if (!foundSession) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
  if (foundSession.ip !== ip) {
    // Notify warning security
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token')
  }

  let payload = null
  try {
    payload = authHelper.verifyToken(refreshToken, foundSession.publicKey)
  } catch (error) {
    const isJWTError =
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError ||
      error instanceof NotBeforeError
    if (isJWTError) throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
    throw new Error(error)
  }
  if (!payload) throw new ApiError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)

  const { publicKey, privateKey } = await authHelper.generateKeyPairRSA()
  const jti = uuidv4()
  const newAccessToken = await authHelper.generateAccessToken({ jti, sub: payload.sub }, privateKey)
  const newRefreshToken = await authHelper.generateRefreshToken(
    { jti, sub: payload.sub },
    privateKey
  )
  await sessionRepo.update(foundSession._id, {
    jti,
    publicKey,
    ip
  })

  return { newAccessToken, newRefreshToken }
}

export default {
  register,
  verify,
  login,
  logout,
  refreshTokenPair
}
