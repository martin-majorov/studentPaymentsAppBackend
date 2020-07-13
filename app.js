var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sqlite3 = require('sqlite3');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const studentsRouter = require('./routes/students');
const paymentsRouter = require('./routes/payments');
const lessonsRouter = require('./routes/lessons');

var app = express();

const db = new sqlite3.Database('database.db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/students', studentsRouter);
app.use('/payments', paymentsRouter);
app.use('/lessons', lessonsRouter);

app.use('/name', (req, res, next) => {
  const name = req.query.name;
  const surname = req.query.surname;
  const sql = `SELECT * FROM Students WHERE name = "${name}" AND surname = "${surname}"`;

  db.get(sql, (error, student) => {
    if(error) {
      next(error);
    } else {
      res.status(200).json({student});
    }
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
