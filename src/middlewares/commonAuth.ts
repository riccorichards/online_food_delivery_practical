import { AuthPayload } from "../dto/Auth.dto";
import { NextFunction, Request, Response } from "express";
import { validateSignature } from "../utility";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = validateSignature(req);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ msg: "User is not authorized" });
  }
};
