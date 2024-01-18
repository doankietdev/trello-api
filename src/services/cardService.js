import { slugify } from '~/utils/formatter'
import cardRepo from '~/repositories/cardRepo'
import columnRepo from '~/repositories/columnRepo'

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

export default {
  createNew
}
