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


const deleteCard = asyncHandler(async (req, res) => {
  await cardService.deleteCard(req.params.id)
  new SuccessResponse({
    message: 'Delete card successfully'
  }).send(res)
})

export default {
  createNew,
  deleteCard
}