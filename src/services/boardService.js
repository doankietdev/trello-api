import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatter'
import boardRepo from '~/repositories/boardRepo'
import columnRepo from '~/repositories/columnRepo'
import cardRepo from '~/repositories/cardRepo'

const getAll = async () => {
  return await boardRepo.findAll()
}

const createNew = async (reqBody) => {
  // handle logic
  const newBoard = {
    ...reqBody,
    slug: slugify(reqBody.title)
  }

  const result = await boardRepo.createNew(newBoard)
  const foundBoard = await boardRepo.findOneById(result.insertedId)
  if (foundBoard) {
    foundBoard.columns = []
  }

  // handle logic with other model

  // send mail, notification

  return foundBoard
}

const getDetails = async (boardId) => {
  const foundBoard = await boardRepo.getDetails(boardId)
  if (!foundBoard) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
  }

  const resBoard = cloneDeep(foundBoard)
  resBoard.columns.forEach(column =>
    column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
  )
  delete resBoard.cards

  return resBoard
}

const update = async (boardId, reqBody) => {
  return await boardRepo.update(boardId, reqBody)
}

const deleteBoard = async (boardId) => {
  await Promise.all([
    boardRepo.deleteOneById(boardId),
    columnRepo.deleteManyByBoardId(boardId),
    cardRepo.deleteManyByBoardId(boardId)
  ])
}

export default {
  getAll,
  createNew,
  getDetails,
  update,
  deleteBoard
}
