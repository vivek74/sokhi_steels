var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    ejs= require('ejs'),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    session = require("express-session"),
    methodOverride = require("method-override"),
    MongoStore = require("connect-mongo")(session),
    User        = require("./models/user");

var indexRoutes  = require("./routes/index");
var inventoryRoutes = require("./routes/inventory");
var sailsRoutes = require("./routes/sails");
var productionRoutes = require("./routes/production");
var adminRoutes = require("./routes/admin");
var messagesRoutes = require("./routes/messages");
var tasksRoutes = require("./routes/tasks");

    
//mongoose.connect("mongodb://localhost/sokhiSteels");
mongoose.connect("mongodb://sokhisteel:sokhi123@ds113936.mlab.com:13936/sokhi");
mongoose.Promise = global.Promise;

// mongoose.connect("mongodb://sokhisteel:sokhi123@ds113936.mlab.com:13936/sokhi").catch(function (reason) {
//     console.log('Unable to connect to the mongodb instance. Error: ', reason);
// });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("database conected!");
});




app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

app.locals.moment = require('moment');

app.use(require("express-session")({
    secret: "sokhi",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection}),
    cookie:{ maxAge: 60 * 60 * 1000 * 24 * 30 }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.session = req.session;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use("/", indexRoutes);
app.use("/", inventoryRoutes);
app.use("/", sailsRoutes);
app.use("/", productionRoutes);
app.use("/", adminRoutes);
app.use("/", messagesRoutes);
app.use("/", tasksRoutes)

app.listen(3000, function(){
    console.log("server started at 3000");
});

// app.listen(process.env.PORT, process.env.IP, function(){
//    console.log("server started");
//  });