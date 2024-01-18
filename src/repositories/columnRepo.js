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
export default {
  createNew,
  findOneById
}
