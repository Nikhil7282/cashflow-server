import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import userRouter from "./routes/userRoutes.js";
import budgetRouter from "./routes/budgetRoutes.js";
import { redisConnection } from "./utils/redisConfig.js";
configDotenv();

const port = process.env.PORT;
const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// redis
try {
  redisConnection();
} catch (error) {
  console.log("Error Connecting to Redis" + error);
}

app.use("/users", userRouter);
app.use("/budgets", budgetRouter);
app.listen(port, () => console.log(`Running at ${port}`));
