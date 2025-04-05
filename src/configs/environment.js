import 'dotenv/config'
import ms from 'ms'
import { DEV_ENV } from '~/utils/constants'

const {
  NODE_ENV,
  MONGODB_URI,
  DATABASE_NAME,
  APP_PORT,
  PORT,
  WHITE_LIST_DOMAINS = [],
  WEBSITE_DOMAIN,
  BREVO_API_KEY,
  BREVO_EMAIL_ADDRESS,
  BREVO_EMAIL_NAME,
  ACCESS_TOKEN_LIFE,
  REFRESH_TOKEN_LIFE
} = process.env

export const BUILD_MODE = NODE_ENV || DEV_ENV
export const APP = {
  PORT: APP_PORT || PORT || 5600,
  WHITE_LIST_DOMAINS: WHITE_LIST_DOMAINS.split(','),
  WEBSITE_DOMAIN: WEBSITE_DOMAIN || 'http://localhost:5173'
}
export const MONGODB = {
  URI: MONGODB_URI || 'mongodb://127.0.0.1:27017',
  DATABASE_NAME: DATABASE_NAME || 'trello'
}
export const BREVO = {
  API_KEY: BREVO_API_KEY,
  EMAIL_ADDRESS: BREVO_EMAIL_ADDRESS,
  EMAIL_NAME: BREVO_EMAIL_NAME
}

export const AUTH = {
  ACCESS_TOKEN_LIFE: ms(ACCESS_TOKEN_LIFE || '1h'),
  REFRESH_TOKEN_LIFE: ms(REFRESH_TOKEN_LIFE || '30d')
}
