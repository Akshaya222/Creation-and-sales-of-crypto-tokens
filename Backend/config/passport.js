const fs = require('fs');
const path = require('path');
const User = require('../models/user') //require('mongoose').model('User');
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;  //to extract jwt token from http header

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

                                        //verify callback
const strategy=new JwtStrategy(options,(payload,done)=>{
   console.log(payload);
     // We will assign the `sub` property on the JWT to the database ID of user
     User.findOne({_id: payload.sub}, function(err, user) {
            
        // This flow look familiar?  It is the same as when we implemented
        // the `passport-local` strategy
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
        
    });

})
module.exports = (passport) => {
    passport.use(strategy);
}