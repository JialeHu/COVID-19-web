
require("dotenv").config(); // Use .env file

const express = require("express");
const mongoose = require("mongoose");
const uuidAPIKey = require('uuid-apikey');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();
app.use(express.static(__dirname + "/build"));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Setup DB
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
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/secrets",   // TODO
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

// Google OAuth Login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));
// Google OAuth callback
app.get("/auth/google/secrets",
    passport.authenticate("google", { failureRedirect: "/" }),
    function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});

// Signup
app.get("/signup", (req, res) => {
    res.send("This will be signup page");
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

// Login
app.get("/login", (req, res) => {
    res.send("This will be login page");
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
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
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
    // res.sendFile(__dirname + "/build/index.html");
    res.send("This will be home page");
});

// Other Requests
app.get('*', (req,res) =>{
    res.redirect("/");
});

// Listen Requests
const listener = app.listen(process.env.PORT || 4000, () => {
    console.log("Server is up on ", listener.address());
});
