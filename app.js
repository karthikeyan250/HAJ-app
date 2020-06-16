const express=require('express');
const app=express();
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const cookieParser = require('cookie-parser');
const flash=require('connect-flash');
const passport=require('passport');
const session=require('express-session');
const bodyParser=require('body-parser');
const methodOverride=require('method-override');


app.use( express.static( "public" ) );
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

//passport config
require('./config/passport')(passport)

//DB config
const db=require('./config/keys').MongoURI;

//Mongo connection
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>console.log("mongodb connected...."))
.catch(err=>console.log(err));


app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended:true}));

app.use(cookieParser('secret'));

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  


app.use('/',require('./routes/index'));
app.use('/users',require('./routes/user'));

app.listen(3000,console.log("server started at http://localhost:3000"));
