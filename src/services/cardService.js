import { StatusCodes } from 'http-status-codes'
import { slugify } from '~/utils/formatter'
import cardRepo from '~/repositories/cardRepo'
import columnRepo from '~/repositories/columnRepo'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  const newCard = {
    ...reqBody,
    slug: slugify(reqBody.title)
  }

  const result = await cardRepo.createNew(newCard)
  const foundCard = await cardRepo.findOneById(result.insertedId)
  if (foundCard) {
    columnRepo.pushCardOrderId(foundCard)
  }

  return foundCard
}

const deleteCard = async (id) => {
  const foundCard = await cardRepo.findOneById(id)
  if (!foundCard) throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')
  await Promise.all([
    cardRepo.deleteOneById(id),
    columnRepo.pullCardOrderId(foundCard)
  ])
  return foundCard
}

export default {
  createNew,
  deleteCard
}
