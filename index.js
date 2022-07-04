const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { default: mongoose } = require('mongoose');
require('dotenv').config();

//middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//router
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const uploadRouter = require('./routes/upload');
const commentRouter = require('./routes/CommentRouter');
const storyRouter = require('./routes/storyRouter');
const conversationRouter = require('./routes/conversationRouter');
const messageRouter = require('./routes/messageRouter');

//connect to mongoDB
mongoose
  .connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connectted'))
  .catch((err) => console.log(err));

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/upload', uploadRouter);
app.use('/story', storyRouter);
app.use('/conversation', conversationRouter);
app.use('/message', messageRouter);
app.get('/', (req, res) => {
  res.send('server started');
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log('server start in ' + port);
});

// socket
const io = require('socket.io')(server, {
  cors: { origin: '*' },
});

// initial list users
let users = [];

// add new user into list users when online
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

// remove user when ofline
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// get user by id into list users
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  console.log('socket connected');

  // when user connect
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('listUser', users);
  });

  // send and get a message
  socket.on('sendMessage', ({ senderId, receiverId, message, conversationId }) => {
    const user = getUser(receiverId);
    io.emit('getMessage', { senderId, message, conversationId });
  });

  // when user disconnect
  socket.on('disconnect', () => {
    console.log('disconnect');
    removeUser(socket.id);
    io.emit('listUser', users);
  });
});
