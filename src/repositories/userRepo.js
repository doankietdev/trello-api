import { ObjectId } from 'mongodb'
import { getDB } from '~/configs/mongodb'
import userModel from '~/models/userModel'

const createNew = async (data) => {
  try {
    const validData = await userModel.validateBeforeCreate(data)
    return await getDB().collection(userModel.COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await getDB().collection(userModel.COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async (email) => {
  try {
    return await getDB().collection(userModel.COLLECTION_NAME).findOne({ email })
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (userModel.INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    return await getDB().collection(userModel.COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw new Error(error)
  }
}

export default {
  createNew,
  findOneById,
  findOneByEmail,
  update
}
