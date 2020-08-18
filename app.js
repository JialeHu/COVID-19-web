
require("dotenv").config(); // Use .env file

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uuidAPIKey = require('uuid-apikey');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const apiServer = require("./apiServer.js");

// --------------------------------Setup Express----------------------------------
const app = express();
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
    useCreateIndex: true
}); // for Deprecate warning
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String,
    uuid: String,
    apiKey: String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(null, user.id);
    });
});

// Google OAuth2.0
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,   //TODO
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,   //TODO
    callbackURL: "https://covid19-ad.herokuapp.com/auth/google/callback",   // TODO
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },  
    function(accessToken, refreshToken, profile, cb) {
        const apis = uuidAPIKey.create(); // Generate Api key
        User.findOrCreate({
            googleId: profile.id
        }, {
            uuid: apis.uuid,
            apiKey: apis.apiKey
        }, 
        function (err, user) {
            return cb(err, user);
        });
    }
));

// -----------------------------Handle Requests---------------------------------
// API Server
apiServer(app, User);

// Google OAuth Login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));
// Google OAuth callback
app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});


app.post("/signup", (req, res) => {
    const apis = uuidAPIKey.create(); // Generate Api key
    User.register({
        email: req.body.email,
        uuid: apis.uuid,
        apiKey: apis.apiKey
    }, req.body.password, (err, user) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/");
            });
        }
    });
});

app.post("/login", (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    req.login(user, (err) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/");
            });
        }
    });
});

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
app.get("/apiKey", (req, res) => {
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
