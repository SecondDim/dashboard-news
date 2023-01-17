import { Context, HttpError } from 'koa'

import config from '../config'
import { logger } from './logger'

export class AppError extends Error {
  constructor (message: any) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.message = message
    logger.error(this.name + ': ' + this.message)
  }
}

export class UnauthorizedError extends AppError {}
export class ForbiddenError extends AppError {}
export class NotFoundError extends AppError {}
export class UnprocessableError extends AppError {}
export class TypeNotExistError extends AppError {}
export class DatabaseNotFoundError extends AppError {}
export class EventStatusForbiddenError extends AppError {}
export class LineNotFoundError extends AppError {}
export class ProcessError extends AppError {}
export class ParamsError extends AppError {}
export class DockerError extends AppError {}

export const errorHandlerWithKao = () => {
  return async (ctx: Context, next: () => Promise<any>): Promise<void> => {
    try {
      await next()
    } catch (error) {
      // if (error instanceof Error) {
      if (error instanceof UnauthorizedError) {
        ctx.status = 401
      } else if (error instanceof AppError) {
        // TODO
        ctx.status = 200
        ctx.body = {
          status: 'app error',
          // message: error.message,
        }
      } else if (error instanceof HttpError) {
        ctx.status = error.statusCode ?? error.status ?? 500
        logger.error(JSON.stringify(error))
        ctx.body = {
          status: 'http error',
          message: JSON.stringify(error),
        }
      } else if (error instanceof Error) {
        ctx.status = 500
        ctx.body = {
          status: error.name,
          message: error.message,
        }
      } else {
        ctx.status = 500
        ctx.body = {
          status: 'unknown',
          message: 'Catch unknown error',
        }
      }
    }
  }
}
