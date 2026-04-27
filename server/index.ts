import { config } from "dotenv";
config()

import express from "express";
import usersController from "./controllers/users";
import activitiesController from "./controllers/activities";
import { DataEnvelope } from "./types";
import { validateJWT } from "./middleware/auth";

const PORT = process.env.PORT ?? 3000;
const SERVER = process.env.SERVER ?? `localhost`;
const STATIC_DIR = process.env.STATIC_DIR ?? "client/dist";

const app = express();

// Middleware
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
}).use(express.json())
.use(validateJWT);


// Routes
app.use(express.static(STATIC_DIR))
  .use("/api/v1/users", usersController)
  .use("/api/v1/activities", activitiesController);

// Error handling
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    const response: DataEnvelope<null> = {
      data: null,
      isSuccess: false,
      message: err.message ?? "An error occurred",
    };
    res.status((err as any).status ?? 500).send(response);
  },
)

app.listen(PORT, () => {
  console.log(`Server is running on port http://${SERVER}:${PORT}`);
});
console.log("listening for requests...");