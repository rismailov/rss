import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodError } from 'zod'

import ErrorResponse from '../types/interfaces/ErrorResponse'

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404)
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
    next(error)
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response<ErrorResponse>,
    _next: NextFunction,
) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    })
}

interface ValidateSchemas {
    body?: AnyZodObject
    params?: AnyZodObject
    query?: AnyZodObject
}

export function validate(schemas: ValidateSchemas) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body)
            }

            if (schemas.params) {
                req.params = await schemas.params.parseAsync(req.params)
            }

            if (schemas.query) {
                req.query = await schemas.query.parseAsync(req.query)
            }

            next()
        } catch (error) {
            if (error instanceof ZodError) {
                console.log(error.errors)

                res.status(422).send(error.errors)
            }

            next(error)
        }
    }
}
