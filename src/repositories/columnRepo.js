import { ObjectId } from 'mongodb'
import columnModel from '~/models/columnModel'
import { getDB } from '~/configs/mongodb'

const createNew = async (board) => {
  try {
    const validColumn = await columnModel.validate(board)
    return await getDB().collection(columnModel.COLLECTION_NAME).insertOne({
      ...validColumn,
      boardId: new ObjectId(validColumn.boardId)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await getDB().collection(columnModel.COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const pushCardOrderId = async (card) => {
  try {
    return await getDB().collection(columnModel.COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card?.columnId) },
      {
        $push: { cardOrderIds: new ObjectId(card?._id) },
        $set: { updatedAt: Date.now() }
      },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (columnId, updateData) => {
  Object.keys(updateData).forEach(fieldName => {
    if (columnModel.INVALID_UPDATE_FIELDS.includes(fieldName)) {
      delete updateData[fieldName]
    }
  })

  try {
    if (updateData?.cardOrderIds) {
      updateData.cardOrderIds = updateData.cardOrderIds.map(cardId => {
        return new ObjectId(cardId)
      })
    }

    return await getDB().collection(columnModel.COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(columnId) },
      { $set: { ...updateData } },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw new Error(error)
  }
}

export default {
  createNew,
  findOneById,
  pushCardOrderId,
  update
}
