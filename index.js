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
app.get('/', (req, res) => {
  res.send('server started');
});

app.listen(process.env.PORT || 7000, () => {
  console.log('server start');
});
