import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatter'

const createNew = (reqBody) => {
  try {
    // handle logic
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // call model

    // handle logic with other model

    // send mail, notification

    // return
    return newBoard
  } catch (error) {
    throw new ApiError()
  }
}

export default {
  createNew
}
