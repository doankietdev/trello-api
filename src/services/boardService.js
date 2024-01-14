import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatter'
import boardRepo from '~/repositories/boardRepo'

const createNew = async (reqBody) => {
  // handle logic
  const newBoard = {
    ...reqBody,
    slug: slugify(reqBody.title)
  }

  const result = await boardRepo.createNew(newBoard)
  const foundBoard = await boardRepo.findOneById(result.insertedId)

  // handle logic with other model

  // send mail, notification

  return foundBoard
}

const getDetails = async (boardId) => {
  const foundBoard = await boardRepo.getDetails(boardId)
  if (!foundBoard) {
    throw new ApiError({ statusCode: StatusCodes.NOT_FOUND, message: 'Board not found' })
  }

  // tranform foundBoard

  return foundBoard
}

export default {
  createNew,
  getDetails
}
