// Node imports

// Local imports

// Third party imports
import express from "express";

const BodyParserMiddleware = express.json({ type: "application/json", limit: "100kb", strict: true });
const FormParserMiddleware = express.urlencoded({ type: "application/x-www-form-urlencoded", limit: "100kb", extended: true });

export { BodyParserMiddleware, FormParserMiddleware };
