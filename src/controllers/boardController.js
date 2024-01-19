import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
import boardService from '~/services/boardService'

const createNew = asyncHandler(async (req, res) => {
  new SuccessResponse({
    statusCode: StatusCodes.CREATED,
    message: ReasonPhrases.CREATED,
    metadata: {
      board: await boardService.createNew(req.body)
    }
  }).send(res)
})

const getDetails = asyncHandler(async (req, res) => {
  new SuccessResponse({
    metadata: {
      board: await boardService.getDetails(req.params.id)
    }
  }).send(res)
})

const update = asyncHandler(async (req, res) => {
  new SuccessResponse({
    metadata: {
      board: await boardService.update(req.params.id, req.body)
    }
  }).send(res)
})

export default {
  createNew,
  getDetails,
  update
}