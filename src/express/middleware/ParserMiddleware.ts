/*
 * File: ParserMiddleware.ts
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

// Third party imports
import express from "express";

const BodyParserMiddleware = express.json({ type: "application/json", limit: "100kb", strict: true });
const FormParserMiddleware = express.urlencoded({ type: "application/x-www-form-urlencoded", limit: "100kb", extended: true });

export { BodyParserMiddleware, FormParserMiddleware };
