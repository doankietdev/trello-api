import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const COLLECTION_NAME = 'boards'
const COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().min(3).max(50).trim().strict().required(),
  description: Joi.string().min(3).max(256).trim().strict().default(null),
  type: Joi.string().min(6).max(7).trim().strict().valid('private', 'public').required(),
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  slug: Joi.string().min(3).trim().strict().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validate = async (board) => {
  try {
    return await COLLECTION_SCHEMA.validateAsync(board, { abortEarly: false })
  } catch (error) {
    throw new Error(error)
  }
}

export default {
  COLLECTION_NAME,
  COLLECTION_SCHEMA,
  validate
}
