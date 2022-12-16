# ExpressJS server boilerplate with decorators

## Why

## How to use

To start the ExpressJS server

```ts
const server = await ExpressServer.getDefault("./controllers");

server.start();
```

Import required class and decorators - optionally middleware as well

```ts
import { Controller, Route, Get, Use } from "../express";
import { BasicAuthMiddleware } from "../express/middleware";
```

Define a controller using the `Route` decorator

_./controllers/AppRoot.ts_
```ts
@Route("/")
class AppRoot extends Controller {
  // ...
}
```

Define one or more methods and decorate them

_./controllers/AppRoot.ts_
```ts
@Route("/")
class AppRoot extends Controller {

  @Get("/ping")
  @Use(BasicAuthMiddleware)
  public ping(req: express.Request, res: express.Response): void {
    res.set("Connection", "close");
    res.status(200).json({ ping: "ok" });
  }
  
}
```