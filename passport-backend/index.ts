import express from "express";
import cors from "cors";
import appRouter from "./routes/app.router";
import { connectToDB } from "./config/database";
import ENV from "./utils/lib/env.config";
import { printWithBorder } from "./utils";
import morgan from "morgan";
import IAdmin from "./interfaces/admin.interface";
import session from "express-session";
import { createServer } from "http";
import startCronJobs from "./utils/cron";
import { redisClient } from "./config/redis";
import SocketService from "./utils/socket";

const app = express();
const server = createServer(app);

// Initialize Socket.io
SocketService.init(server);

app.use(cors({ origin: "*", methods: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(
  session({
    secret: ENV.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", appRouter);

connectToDB()
  .then(() =>
    server.listen(ENV.PORT, () => {
      startCronJobs();
      printWithBorder("SERVER IS UP AND RUNNING @ " + ENV.PORT);
    })
  )
  .catch((error) => console.log(error));

declare global {
  namespace Express {
    interface Request {
      // @ts-ignore
      session: {
        user?: {
          _id: string;
          email: string;
        } & { [key: string]: any };
        admin?: IAdmin;
      };
    }
  }
}

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));

const currentDateTime = new Date().toLocaleString();

app.get("/", (req, res) => {
  console.log("API is working");
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Status</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f4f4f4;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #007BFF;
        }
        p {
          font-size: 1.1em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>API Status</h1>
        <p>API IS WORKING - LTS.</p>
        <p><strong>API Last Changed Time:</strong> ${currentDateTime}</p>
      </div>
    </body>
    </html>
  `);
});
