import { slugify } from '~/utils/formatter'
import columnRepo from '~/repositories/columnRepo'
import boardRepo from '~/repositories/boardRepo'

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

export default {
  createNew,
  update
}
