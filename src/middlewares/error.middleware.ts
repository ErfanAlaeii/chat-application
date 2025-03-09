import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export default function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  logger.error(err.message, { stack: err.stack });


  res.status(500).json({
    message: "An unexpected error occurred",
    error: err.message,
  });
}
