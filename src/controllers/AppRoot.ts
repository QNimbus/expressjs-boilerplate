/*
 * File: AppRoot.ts
 * Path: /src/controllers
 * Project: expressjs-boilerplate
 * Version: 0.0.2
 * Copyright (c) 2022 BeSquared
 * -----
 * Author: B. van Wetten at <bas@vanwetten.com>
 * Created: 17-12-2022 12:55
 * 
 * Modified: 17-12-2022 14:22
 * Modified by: B. van Wetten at <bas@vanwetten.com>
 * -----
 */

// Node imports

// Local imports
import { Controller, Route, Get } from "../express";

// Third party imports
import express from "express";

@Route("/")
class AppRoot extends Controller {
  @Get("/ping")
  public ping(req: express.Request, res: express.Response): void {
    res.set("Connection", "close");
    res.status(200).json({ ping: "ok" });
  }
}

export default AppRoot;
