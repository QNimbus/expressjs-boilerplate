// Node imports

// Local imports
import { Controller, Route, Get, Use } from "../express";
import { BasicAuthMiddleware } from "../express/middleware";

// Third party imports
import express from "express";

@Route("/")
class AppRoot extends Controller {
  @Get("/ping")
  @Use(BasicAuthMiddleware)
  public ping(req: express.Request, res: express.Response): void {
    res.set("Connection", "close");
    res.status(200).json({ ping: "ok" });
  }
}

export default AppRoot;
