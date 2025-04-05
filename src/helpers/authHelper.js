import { StatusCodes } from 'http-status-codes'
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { AUTH } from '~/configs/environment'
import ApiError from '~/utils/ApiError'
import { generateKeyPair } from 'node:crypto'

/**
 * @returns {Promise<{ publicKey: string, privateKey: string }>}
 */
const generateKeyPairRSA = () => {
  return new Promise((resolve, reject) => {
    generateKeyPair(
      'rsa',
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      },
      (err, publicKey, privateKey) => {
        if (err) return reject(err)
        resolve({ publicKey, privateKey })
      }
    )
  })
}

/**
 * @param {{
 *  jti: string
 *  sub: string
 * }} payload
 * @param {string} privateKey
 * @returns {Promise<string>}
 */
const generateAccessToken = (payload, privateKey) => {
  const { jti, sub, ...restPayload } = payload
  return new Promise((resolve, reject) => {
    jwt.sign(
      restPayload,
      privateKey,
      {
        jwtid: jti,
        subject: sub,
        algorithm: 'RS256',
        expiresIn: AUTH.ACCESS_TOKEN_LIFE
      },
      (err, encoded) => {
        if (err) return reject(err)
        if (encoded) {
          resolve(encoded)
        } else {
          reject(new Error('Access token generation failed'))
        }
      }
    )
  })
}

/**
 * @param {{
 *  jti: string
 *  sub: string
 * }} payload
 * @param {string} privateKey
 * @returns {Promise<string>}
 */
const generateRefreshToken = (payload, privateKey) => {
  const { jti, sub, ...restPayload } = payload
  return new Promise((resolve, reject) => {
    jwt.sign(
      restPayload,
      privateKey,
      {
        jwtid: jti,
        subject: sub,
        algorithm: 'RS256',
        expiresIn: AUTH.REFRESH_TOKEN_LIFE
      },
      (err, encoded) => {
        if (err) return reject(err)
        if (encoded) {
          resolve(encoded)
        } else {
          reject(new Error('Refresh token generation failed'))
        }
      }
    )
  })
}

/**
 * @param {string} token
 */
const decodeToken = (token) => {
  return jwt.decode(token, { json: true })
}

/**
 * @param {string} token
 * @param {string} publicKey
 */
const verifyToken = (token, publicKey) => {
  return jwt.verify(token, publicKey)
}

export default {
  generateKeyPairRSA,
  generateAccessToken,
  generateRefreshToken,
  decodeToken,
  verifyToken
}
