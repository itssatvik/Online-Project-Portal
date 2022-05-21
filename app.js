// MISC
require('dotenv').config();
require('express-async-errors');
const morgan = require('morgan');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
const expressLayouts = require('express-ejs-layouts');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
// const rateLimiter = require('express-rate-limit');

// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


// Setting proxy
// app.set('trust proxy', 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );

// Setting up middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(cookieParser());


// Method override
app.use(
  methodOverride ( (req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Setting up view Engine

app.use(express.static('public'));
app.use(expressLayouts);
app.set('view engine', 'ejs');



// routes
app.use('/', require('./routes/index'));
app.use('/auth', authRouter);
app.use('/jobs', jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    const conn = await connectDB(process.env.MONGO_URI || "mongodb+srv://salik:1234@cluster0.cctv5.mongodb.net/Major?retryWrites=true&w=majority");
    console.log(`MongoDB Connected : ${conn.connection.host}`);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
