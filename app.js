var express = require('express');
var app = express();

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var socket = require("socket.io");
var http = require('http');
var cors = require('cors');
var node_media_server = require('./media_server');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { db } = require('./models/Users');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

//Connection to the data base
mongoose.connect('mongodb+srv://Cod3Lif3:aZERTYUIOP_973@cluster0.whwmt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{ 
  useNewUrlParser: true,
  useUnifiedTopology: true 
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function (req, res){
  res.sendFile(__dirname + '/index.html')
});

app.get('/chat', function (req, res){
  res.sendFile(__dirname + '/chat.html')
});

app.get('/stream', function(req,res){
  res.sendFile(__dirname + '/stream.html')
});

//socket emit and reception
var server = app.listen(3000, console.log("Listening to port 3000"));
var io = socket(server);
var activeUsers = new Set();
io.on('connection',function(socket){
  console.log("Made socket connection!");
  
  socket.on('new user', function(data){
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user",[...activeUsers]);
   });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });

  socket.on("chat message", function(data){
    io.emit("chat message",data);
  });

  socket.on("typing", function(data){
    socket.broadcast.emit("typing", data);
  });
});

node_media_server.run();

module.exports = app;
