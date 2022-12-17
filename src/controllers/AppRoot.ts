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
