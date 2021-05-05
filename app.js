var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var app = express();
var http = require('http');
var cors = require('cors');


var NodeMediaServer = require('node-media-server');

var config = {
  rtmp:{
    port: 1935,
    chunk_size: 6000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },

  http:{
    port: 8000, 
    allow_origin: '*'
  }
};

var nms = new NodeMediaServer(config)
nms.run();

require('./models/Users');

mongoose.connect('mongodb+srv://Cod3Lif3:aZERTYUIOP_973@cluster0.whwmt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatRouter = require('./routes/chat');
const { db } = require('./models/Users');



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

var server = http.createServer(app);
var io = require('socket.io')(server);
server.listen(3000, console.log("Listening to port 3000"));
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


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);

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
