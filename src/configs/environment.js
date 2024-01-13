import 'dotenv/config'
import { DEV_ENV } from '~/utils/constants'

const {
  NODE_ENV,
  MONGODB_URI,
  DATABASE_NAME,
  APP_HOST,
  APP_PORT
} = process.env

export const BUID_MODE = NODE_ENV || DEV_ENV
export const APP = {
  HOST: APP_HOST || 'localhost',
  PORT: APP_PORT || 5600
}
export const MONGODB = {
  URI: MONGODB_URI || '',
  DATABASE_NAME: DATABASE_NAME || ''
}
