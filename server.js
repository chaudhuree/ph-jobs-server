const { readdirSync } = require("fs");
require('dotenv').config();
require('express-async-errors'); //no need any try catch for this package
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');


// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://chaudhuree-jobs.netlify.app',
  ],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(express.json());
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors( corsOptions ));
app.use(xss());
app.use(express.urlencoded({ extended: false }));
app.use(helmet({crossOriginResourcePolicy: false}))

// error handler
const notFoundMiddleware = require('./middleware/notfound.js');

// routes middleware
readdirSync("./routes").map(r => app.use("/api/v1", require(`./routes/${r}`))) 


// routes
app.get('/', (req, res) => {
  res.send('server is running');
});

//db connection
const connectDB = require('./db/connect.js');


// //if no route found
app.use(notFoundMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();