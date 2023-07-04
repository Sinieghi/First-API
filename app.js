require("dotenv").config();
require("express-async-errors");
//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

//connectDB
const coneectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
//router
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 10 * 60 * 1000, //15min
    max: 100, //limit each ip  to 100 request
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages
app.get("/", (req, res) => {
  res.send("API");
});

// routes
app.use("/api/v1/auth", authRouter); //passo1
//depois de configurar o user foca nas infos que não é cadastrais, como os jobs desse projeto
app.use("/api/v1/jobs", authenticateUser, jobsRouter); //passo2

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await coneectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
