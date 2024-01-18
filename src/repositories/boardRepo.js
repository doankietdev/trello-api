import { ObjectId } from 'mongodb'
import boardModel from '~/models/boardModel'
import columnModel from '~/models/columnModel'
import cardModel from '~/models/cardModel'
import { getDB } from '~/configs/mongodb'

const createNew = async (board) => {
  try {
    const validBoard = await boardModel.validate(board)
    return await getDB().collection(boardModel.COLLECTION_NAME).insertOne(validBoard)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await getDB().collection(boardModel.COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (boardId) => {
  try {
    return (await getDB().collection(boardModel.COLLECTION_NAME).aggregate([
      { $match: {
        _id: new ObjectId(boardId)
      } },
      { $lookup: {
        from: columnModel.COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      } },
      { $lookup: {
        from: cardModel.COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      } }
    ]).toArray())[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

export default {
  createNew,
  findOneById,
  getDetails
}
