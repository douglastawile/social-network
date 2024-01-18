import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";
import path, {dirname} from "path";
import { fileURLToPath } from "url";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

const app = express();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", authRoute);
app.use("/api", userRoute);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("API Running...");
});

export default app;
