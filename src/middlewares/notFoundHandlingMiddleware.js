import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import asyncHandler from '~/utils/asyncHandler'

const notFoundHandlingMiddleware = asyncHandler(async (req, res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND))
})

export default notFoundHandlingMiddleware
