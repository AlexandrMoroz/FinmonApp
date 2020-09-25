const User = require("../models/User");
const { SECRET } = require("../config");
const { Strategy, ExtractJwt } = require("passport-jwt");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET
};

module.exports = passport => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      await User.findOne({_id:payload._id,username:payload.username})
        .then(user => {

          if (!user.block) {
            return done(null, user);
          }
          
          return done(null, false);
        })
        .catch(err => {
          console(err)
          return done(null, false);
        });
    })
  );
};
