const User = require("../models/User");
const { Strategy, ExtractJwt } = require("passport-jwt");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = (passport, SECRET) => {
  passport.use(
    new Strategy({ ...opts, secretOrKey: SECRET }, async (payload, done) => {
      await User.findOne({ _id: payload._id, username: payload.username })
        .then((user) => {
          if (!user.block) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => {
          console.log(err);
          return done(null, false);
        });
    })
  );
};
