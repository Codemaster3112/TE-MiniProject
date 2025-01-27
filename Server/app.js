const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const postRoutes = require("./routes/postRoute");
const userRoutes = require("./routes/userRoutes");
const session = require("express-session");
const User = require("./models/User");

mongoose
  .connect("mongodb://localhost:27017/SocialMediaMarketplace", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("connected"))
  .catch((e) => {
    console.log(e);
  });

// ********  app.use()  ***********

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const sessionConfig = {
  secret: "thiscouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// *******  routes  *********
app.use("/user", userRoutes);
app.use("/posts", postRoutes);

app.get("/home", (req, res) => {
  res.send("Hello from server");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(req);
  console.log(email, password);
  if (email == "rupeshagarwal955@gmail.com" && password == "Rupesh") {
    console.log(email);
    res.send(true);
  } else {
    console.log("fail");
    res.send(false);
  }
});

// ***********  server start  **********

app.listen(8000, () => {
  console.log("app is listening");
});
