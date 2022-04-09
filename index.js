const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const { default: mongoose } = require('mongoose');

//router
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const uploadRouter = require('./routes/upload');

//middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

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
app.use('/upload', uploadRouter);
app.get('/', (req, res) => {
  res.send('server started');
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log('server start on port ' + PORT);
});
