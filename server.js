var express = require('express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersRouter = require("./routes/UsersRout");
var algoRouter = require("./routes/algoRout");
var fileuploadRouter = require("./routes/UploadRout");


var app = express();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/api/register", usersRouter);
app.use("/api/LoginForm", usersRouter);
app.use('/api/algo', algoRouter);
app.use("/api/upload", fileuploadRouter);
app.use(express.static("./uploads"));


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
