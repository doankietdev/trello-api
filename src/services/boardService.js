import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatter'
import boardRepo from '~/repositories/boardRepo'

const createNew = async (reqBody) => {
  try {
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
  } catch (error) {
    throw new ApiError()
  }
}

export default {
  createNew
}
