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
export default {
  createNew,
  findOneById
}
