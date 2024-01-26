import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import SuccessResponse from '~/utils/SuccessResponse'
import asyncHandler from '~/utils/asyncHandler'
import boardService from '~/services/boardService'

const getAll = asyncHandler(async (req, res) => {
  new SuccessResponse({
    metadata: {
      boards: await boardService.getAll()
    }
  }).send(res)
})

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

const deleteBoard = asyncHandler(async (req, res) => {
  await boardService.deleteBoard(req.params.id)
  new SuccessResponse({
    message: 'Delete board successfully'
  }).send(res)
})

export default {
  getAll,
  createNew,
  getDetails,
  update,
  deleteBoard
}