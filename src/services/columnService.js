import { slugify } from '~/utils/formatter'
import columnRepo from '~/repositories/columnRepo'
import boardRepo from '~/repositories/boardRepo'
import cardRepo from '~/repositories/cardRepo'

const createNew = async (reqBody) => {
  const newColumn = {
    ...reqBody,
    slug: slugify(reqBody.title)
  }

  const result = await columnRepo.createNew(newColumn)
  const foundColumn = await columnRepo.findOneById(result.insertedId)
  if (foundColumn) {
    boardRepo.pushColumnOrderId(foundColumn)
    foundColumn.cards = []
  }

  return foundColumn
}

const update = async (columnId, reqBody) => {
  return await columnRepo.update(columnId, reqBody)
}

const moveCardToAnotherColumn = async (reqBody) => {
  const {
    cardId,
    prevColumnId,
    cardOrderIdsOfPrevColumn,
    nextColumnId,
    cardOrderIdsOfNextColumn
  } = reqBody || {}

  await Promise.all([
    columnRepo.update(prevColumnId, { cardOrderIds: cardOrderIdsOfPrevColumn }),
    columnRepo.update(nextColumnId, { cardOrderIds: cardOrderIdsOfNextColumn }),
    cardRepo.update(cardId, { columnId: nextColumnId })
  ])
}

export default {
  createNew,
  update,
  moveCardToAnotherColumn
}
