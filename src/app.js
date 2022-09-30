require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

const userRouter = require('./router/index');

const { auth, adminOnly } = require('./auth/auth.middleware')

const port = process.env.PORT || 3000
const app = express();

app.use(session({
     secret: process.env.SESSION_SECRET,
     resave: true,
     saveUninitialized: true,
}));

app.use(flash());

app.use((err, req, res, next) => {
     res.locals.message = req.flash();
     next();
})

const viewPath = path.join(__dirname, '../src/views');
const publicPath = path.join(__dirname, '../src/public');

// require database
const connectDB = require('../src/config/database');

app.use(helmet())
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicPath));
app.set('view engine', 'ejs');
app.set('views', viewPath);

// route that handle register route
app.get('/register', function (req, res) {
     req.flash('message', false)
     res.render('register', { title: "Create Account", message: null });
});

app.use(userRouter);

// route that handle login router
app.get('/login', function (req, res) {
     req.flash('message', null)
     res.render('login', { title: "Login", message: null })
});

// app.get('/', function (req, res) {
//      res.render('login');
// });


app.get('/dashboard', adminOnly, function (req, res) {
     const user = req.user
     res.render('dashboard', {
          user: user
     });
})


const startServer = () => {
     try {
          connectDB(process.env.MONGO_URI)
          app.listen(port, () => {
               console.log(`server listening on port ${port}`);
          })
     } catch (err) {

     }
}

startServer();