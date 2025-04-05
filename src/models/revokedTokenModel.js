import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const COLLECTION_NAME = 'revoked_token'
const COLLECTION_SCHEMA = Joi.object({
  jti: Joi.string().required().uuid({ version: 'uuidv4' }),
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'jti', 'publicKey', 'ip', 'userId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

export default {
  COLLECTION_NAME,
  COLLECTION_SCHEMA,
  INVALID_UPDATE_FIELDS,
  validateBeforeCreate
}
