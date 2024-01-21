import { ObjectId } from 'mongodb'
import cardModel from '~/models/cardModel'
import { getDB } from '~/configs/mongodb'

const createNew = async (card) => {
  try {
    const validCard = await cardModel.validate(card)
    return await getDB().collection(cardModel.COLLECTION_NAME).insertOne({
      ...validCard,
      boardId: new ObjectId(validCard.boardId),
      columnId: new ObjectId(validCard.columnId)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await getDB().collection(cardModel.COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (cardId, updateData) => {
  Object.keys(updateData).forEach(fieldName => {
    if (cardModel.INVALID_UPDATE_FIELDS.includes(fieldName)) {
      delete updateData[fieldName]
    }
  })

  try {
    if (updateData?.boardId) {
      updateData.boardId = new ObjectId(updateData.boardId)
    }
    if (updateData?.columnId) {
      updateData.columnId = new ObjectId(updateData.columnId)
    }

    return await getDB().collection(cardModel.COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: { ...updateData } },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByColumnId = async (columnId) => {
  try {
    return await getDB().collection(cardModel.COLLECTION_NAME).deleteMany({
      columnId: new ObjectId(columnId)
    })
  } catch (error) {
    throw new Error(error)
  }
}

export default {
  createNew,
  findOneById,
  update,
  deleteManyByColumnId
}
