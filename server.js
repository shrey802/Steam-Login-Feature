const express       = require("express");
const passport      = require("passport");
const session       = require("express-session");
const app           = express();
const port          = 5000; 
const mongoose = require("mongoose");
const User = require("./models/user");
mongoose.connect('mongodb://localhost:27017/Bettertebex', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to database');
}).catch(err => {   // Error handling
    console.log(err);
});

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

const SteamStrategy = require("passport-steam").Strategy;

// const users = [];

// passport.use(new Steamstrategey({
//     returnURL: 'http://localhost:5000/auth/steam/return',
//     realm: 'http://localhost:5000/',
//     apikey: '133C858093F5231A65F7C9FC1F7FFF57',
//     stateless: true
// },
// // (identifier, profile, done) => {
// //     process.nextTick(() => {
// //         profile.identifier = identifier;
// //         console.log(users);
// //         users.push(profile)
// //         return done(null, {profile});
// //     })
// function(identifier, profile, done){
//     process.nextTick(function(){
//         profile.identifier = identifier;
//         users.push(profile);
//         return done(null, {profile});
//         });
//     }
//     )
// )

// passport.use(
//   new SteamStrategy(
//     {
//       returnURL: "http://localhost:5000/auth/steam/return",
//       realm: "http://localhost:5000/",
//       apiKey: "133C858093F5231A65F7C9FC1F7FFF57",
//     },
//     function (identifier, profile, done) {
//       // asynchronous verification, for effect...
//       process.nextTick(function () {
//         profile.identifier = identifier;
//         console.log(identifier);
//         users.push(profile);
//         return done(null, {profile});
//       });
//     }
//   )
// );


passport.use(
    new SteamStrategy(
      {
        returnURL: "http://localhost:5000/auth/steam/return",
        realm: "http://localhost:5000/",
        apiKey: "133C858093F5231A65F7C9FC1F7FFF57",
      },
      function (identifier, profile, done) {
        process.nextTick(function () {
          profile.identifier = identifier;
          // Console.log user
          console.log(profile);
          // Input user into database
          User.findOne({ identifier: identifier }, function (err, user) {
            if (err) {
              return done(err);
            }
            if (!user) {
              user = new User({
                identifier: identifier,
                displayName: profile.displayName,
                avatar: profile._json.avatarmedium,
                steamId: profile._json.steamid,
                isPrivate: profile._json.profilestate,
  
              });
              user.save(function (err) {
                if (err) {
                  return done(err);
                }
                return done(null, user);
              });
            } else {
              return done(null, user);
            }
          });
        });  
      }
    )
  );

// Middleware

app.use(express.json());
app.use(
  session({
    secret: "test",
    name: "test",
    resave: true,
    saveUninitialized: true,
  })
);

// Router
app.use("/", require("./routes/routes"));


app.get("/", (req, res) => {
  try {
    res.json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.get("/auth/steam", passport.authenticate("steam", { failureRedirect: "/" }), function (req, res) {
  res.redirect("/");
});

app.get("/auth/steam/return", passport.authenticate("steam", { failureRedirect: "/" }), function (req, res) {
  res.redirect("/");
});

app.listen(port, () => {
    console.log("Server started");
})

