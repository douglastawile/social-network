import chalk from "chalk";
import app from "./express.js";
import { connectionDB } from "./database/connectDB.js";

connectionDB();

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(
      `Server running on http://localhost:${chalk.red(process.env.PORT)}`
    );
  }
});
