const express = require("express"),
app           = express(),
bodyParser    = require("body-parser"),
mongoose      = require("mongoose"),
flash         = require("connect-flash"),
passport      = require("passport"),
LocalStrategy = require("passport-local"),
methodOverride = require("method-override"),
Campground    = require("./models/campgrounds"),
Comment       = require("./models/comment"),
User          = require("./models/user"),
seedDB        = require("./seed")

//requiring routes
const commentRoutes = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes = require("./routes/index")

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cuttest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true } )
// mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
// mongoose.connect("mongodb+srv://danielvidal:<password>@cluster0.bo3l9.azure.mongodb.net/<dbname>?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// seedDB(); //seed the database

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 5000, process.env.IP, function() {
    console.log("Yelpcamp server has started!");
});