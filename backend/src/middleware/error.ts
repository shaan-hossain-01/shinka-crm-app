import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: "Not Found" }
  })
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const status = typeof err?.status === "number" ? err.status : 500;
  const code = err?.code ?? (status === 500 ? "INTERNAL_ERROR" : "ERROR");
  const message = err?.message ?? "Something went wrong";

  const details = process.env.NODE_ENV === "development" ? { stack: err?.stack } : undefined;

  res.status(status).json({
    error: { code, message, details }
  })

}
