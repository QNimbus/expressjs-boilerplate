// Node imports

// Local imports
import { appConfig } from "../../config";

// Third party imports
import express, { NextFunction } from "express";

const BasicAuthMiddleware = (req: express.Request, res: express.Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No credentials sent" });
  }

  const [_, authToken] = req.headers.authorization.split(" ");

  if (authToken !== appConfig.express.authToken) {
    return res.status(403).json({ error: "Wrong credentials sent" });
  }

  return next();
};

export { BasicAuthMiddleware };
