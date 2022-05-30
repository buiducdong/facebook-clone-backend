const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
const port = process.env.PORT || 7000;

const { default: mongoose } = require('mongoose');

//router
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const uploadRouter = require('./routes/upload');
const commentRouter = require('./routes/commentRouter');
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

app.listen(port, () => {
  console.log('server start on port ' + port);
});
