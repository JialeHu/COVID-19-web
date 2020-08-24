
require("dotenv").config(); // Use .env file

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uuidAPIKey = require('uuid-apikey');
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const apiServer = require("./apiServer.js");

// --------------------------------Setup Express----------------------------------
const app = express();
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/build"));
app.use(session({
    secret: process.env.SESSION_SECRET, //TODO
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// --------------------------------Setup DB----------------------------------
// const url = "mongodb://localhost:27017/covid19DB" // TODO
const url = "mongodb+srv://covid19-app:hjl123321@cluster0.wjy9x.mongodb.net/covid19DB?retryWrites=true&w=majority";
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}); // for Deprecate warning
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    googleId: String,
    uuid: String,
    apiKey: String,
    count: Number
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());
// passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            done(null, user);
        } else {
            done("Username or password does not match", null);
        }
    });
});

// Google OAuth2.0
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,   //TODO
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,   //TODO
    callbackURL: "https://covid19-d.herokuapp.com/auth/google/callback",   // TODO
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },  
    function(accessToken, refreshToken, profile, cb) {
        const apis = uuidAPIKey.create(); // Generate Api key
        User.findOrCreate({
            googleId: profile.id
        }, {
            username: profile.emails[0].value,
            uuid: apis.uuid,
            apiKey: apis.apiKey,
            count: 0
        }, 
        function (err, user) {
            return cb(err, user);
        });
    }
));

// -----------------------------API Server-------------------------
apiServer(app, User);

//-------------------------------Web Server------------------------
// Google OAuth Login
app.get("/auth/google", passport.authenticate("google", { scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
] }));
// Google OAuth callback
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }),
    function(_, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});


// app.post("/signup", (req, res) => {
//     if (req.isAuthenticated()) {
//         res.redirect("/");
//         return;
//     }
//     const apis = uuidAPIKey.create(); // Generate Api key
//     User.register(new User({
//         username: req.body.email,
//         email: req.body.email,
//         uuid: apis.uuid,
//         apiKey: apis.apiKey
//     }), req.body.password, (err, user) => {
//         if (err) {
//             console.error(err);
//             res.sendStatus(500);
//         } else {
//             console.log(user); // TODO
//             passport.authenticate("local", (err, user, info) => {
//                 if (err) return next(err);
//                 if (!user) res.redirect("/");
                
//                 req.logIn(user, (err) => {

//                 });
//             })(req, res, next);
//         }
//     });
// });

app.post("/signup", (req, res, next) => {
    const apis = uuidAPIKey.create(); // Generate Api key
    User.register(new User({
        username: req.body.username,
        uuid: apis.uuid,
        apiKey: apis.apiKey,
        count: 0
    }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
        }
        next();
    });
}, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
}));

// app.post("/login", (req, res) => {
//     if (req.isAuthenticated()) return res.redirect("/");

//     const user = new User({
//         username: req.body.username,
//         password: req.body.password
//     });

//     req.login(user, (err) => {
//         if (err) {
//             console.error(err);
//             res.sendStatus(500);
//         } else {
//             passport.authenticate("local")(req, res, () => {
//                 res.redirect("/");
//             });
//         }
//     });
// });

app.post('/login', passport.authenticate('local', 
    { 
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true 
    })
);

app.post("/isloggedin", (req, res) => {
    if (req.isAuthenticated()) {
        res.send(true);
    } else {
        res.send(false);
    }
});

// Logout
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// API Key
app.get("/apikey", (req, res) => {
    if (req.isAuthenticated()) {
        User.findById(req.user, function(err, foundUser){
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else if (foundUser) {
                res.send(foundUser.apiKey);
            } else {
                res.sendStatus(404);
            }
        });
    } else {
        res.sendStatus(403);
    }
});

// API Count
app.get("/apicount", (req, res) => {
    if (req.isAuthenticated()) {
        User.findById(req.user, function(err, foundUser){
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else if (foundUser) {
                res.send(foundUser.count.toString());
            } else {
                res.sendStatus(404);
            }
        });
    } else {
        res.sendStatus(403);
    }
});

// Home
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/build/index.html");
});

// Other Requests
app.get('*', (req,res) =>{
    res.redirect("/");
});

// Listen Requests
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up on ", listener.address());
});
