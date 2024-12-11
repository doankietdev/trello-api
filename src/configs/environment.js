import 'dotenv/config'
import { DEV_ENV } from '~/utils/constants'

const {
  NODE_ENV,
  MONGODB_URI,
  DATABASE_NAME,
  APP_PORT,
  PORT,
  WHITE_LIST_DOMAINS = []
} = process.env

export const BUILD_MODE = NODE_ENV || DEV_ENV
export const APP = {
  PORT: APP_PORT || PORT || 5600,
  WHITE_LIST_DOMAINS: WHITE_LIST_DOMAINS.split(',')
}
export const MONGODB = {
  URI: MONGODB_URI || 'mongodb://127.0.0.1:27017',
  DATABASE_NAME: DATABASE_NAME || 'trello'
}
