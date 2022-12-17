/*
 * File: AuthMiddleware.ts
 * Path: /src/express/middleware
 * Project: expressjs-boilerplate
 * Version: 0.0.2
 * Copyright (c) 2022 BeSquared
 * -----
 * Author: B. van Wetten at <bas@vanwetten.com>
 * Created: 17-12-2022 12:55
 * 
 * Modified: 17-12-2022 14:32
 * Modified by: B. van Wetten at <bas@vanwetten.com>
 * -----
 */

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
