import { ObjectId } from 'mongodb'
import { getDB } from '~/configs/mongodb'
import sessionModel from '~/models/sessionModel'

const createNew = async (data) => {
  try {
    const validData = await sessionModel.validateBeforeCreate(data)
    return await getDB().collection(sessionModel.COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await getDB()
      .collection(sessionModel.COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByJtiAndUserId = async ({ jti, userId }) => {
  try {
    return await getDB().collection(sessionModel.COLLECTION_NAME).findOne({ jti, userId })
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (sessionModel.INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    return await getDB()
      .collection(sessionModel.COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...updateData,
            updatedAt: Date.now()
          }
        },
        { returnDocument: 'after' }
      )
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByJtiAndUserId = async ({ jti, userId }) => {
  try {
    const { deletedCount } = await getDB()
      .collection(sessionModel.COLLECTION_NAME)
      .deleteOne({ jti, userId })
    return !!deletedCount
  } catch (error) {
    throw new Error(error)
  }
}

export default {
  createNew,
  findOneById,
  findOneByJtiAndUserId,
  update,
  deleteByJtiAndUserId
}
