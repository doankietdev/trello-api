import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
import boardService from '~/services/boardService'

const createNew = asyncHandler(async (req, res) => {
  new SuccessResponse({
    statusCode: StatusCodes.CREATED,
    message: ReasonPhrases.CREATED,
    metadata: {
      board: boardService.createNew(req.body)
    }
  }).send(res)
})

export default {
  createNew
}