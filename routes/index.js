var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "ChatX" });
});

router.post("/chat", (req, res, next) => {
  const { username, room } = req.body;
  const user = {
    username,
    room,
  };
  if (!username && !room) {
    res.status(400).json({
      success: false,
      message: `Enter your username and room name`,
    });
    return;
  }

  res.cookie("user", user, {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "You are now logged in",
  });
});

router.get("/chat", (req, res, next) => {
  if (req.cookies.user) {
    res.status(200).render("chat", {
      title: "ChatX - Public",
    });
    return;
  } else {
    res.redirect("/");
  }
});

router.get('/private', (req, res, next) => {
  res.send(`I am currently working on this page.. Check back pretty soon 😉😉
  <a href="/">Go back</a>`)
})

router.get('/logout', (req, res, next) => {
  res.clearCookie('user')
  res.clearCookie('io')
  res.redirect('/')
})

module.exports = router;
