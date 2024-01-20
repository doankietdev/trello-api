import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
import columnService from '~/services/columnService'

const createNew = asyncHandler(async (req, res) => {
  new SuccessResponse({
    statusCode: StatusCodes.CREATED,
    message: ReasonPhrases.CREATED,
    metadata: {
      column: await columnService.createNew(req.body)
    }
  }).send(res)
})

const update = asyncHandler(async (req, res) => {
  new SuccessResponse({
    metadata: {
      column: await columnService.update(req.params.id, req.body)
    }
  }).send(res)
})

const moveCardToAnotherColumn = asyncHandler(async (req, res) => {
  await columnService.moveCardToAnotherColumn(req.body)
  new SuccessResponse({
    message: 'Move card to another column successfully'
  }).send(res)
})

export default {
  createNew,
  update,
  moveCardToAnotherColumn
}