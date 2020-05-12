const session = require("express-session");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  // app.use(passport.initialize());
  // app.use(passport.session());
};
