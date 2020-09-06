require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
// var redis = require("redis");
// var session = require("express-session");
// var redisStore = require("connect-redis")(session);
const cookieParser = require("cookie-parser");
// var client = redis.createClient();
const app = express();
const logger = require("morgan");
const chatRouter = require("./routes/index");
const { chatMessage } = require("./utils/socket");

// const client  = redis.createClient();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(
//   session({
//     secret: process.env.SECRET_KEY,
//     resave: false,
//     store: new redisStore({ host: "localhost", port: 6379, client: client }),
//     saveUninitialized: false,
//     cookie: { secure: true, maxAge: 60000 },
//   })
// );

chatMessage(io);

app.use("/", chatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
