import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
import cardService from '~/services/cardService'

const createNew = asyncHandler(async (req, res) => {
  new SuccessResponse({
    statusCode: StatusCodes.CREATED,
    message: ReasonPhrases.CREATED,
    metadata: {
      card: await cardService.createNew(req.body)
    }
  }).send(res)
})

export default {
  createNew
}