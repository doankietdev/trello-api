import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'

const createNew = asyncHandler(async (req, res) => {
  new SuccessResponse({
    statusCode: StatusCodes.CREATED,
    message: ReasonPhrases.CREATED,
    metadata: {
      reqBody: { ...req.body }
    }
  }).send(res)
})

export default {
  createNew
}