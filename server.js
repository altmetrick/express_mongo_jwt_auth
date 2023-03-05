require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { logger } = require('./middleware/logEvents');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const errorHandler = require('./middleware/errorHandler');

const rootRouter = require('./routes/root');
const registerRouter = require('./routes/register');
const logOutRouter = require('./routes/logout');
const authRouter = require('./routes/auth');
const refreshTokenRouter = require('./routes/refreshToken');
const employeesRouter = require('./routes/employees');

const app = express();

//custom middleware
app.use(logger);

//handle options credentials check - before CORS
app.use(credentials);
//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//built in middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//serve static files
//in this example, every dir and file in 'public' directory will be public
// public/css/styles.css = you can access from browser ..localhost:3000/ccs/styles.css
//serve static files for different routes
app.use('/', express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', rootRouter);

//API Routes
app.use('/api/v1/register', registerRouter);
app.use('/api/v1/login', authRouter);
app.use('/api/v1/logout', logOutRouter);
app.use('/api/v1/refresh', refreshTokenRouter);

app.use(verifyJWT);
app.use('/api/v1/employees', employeesRouter);

//404 Not found
app.all('*', (req, res) => {
  res.status(404);

  if (req.accepts('html')) {
    return res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepted('json')) {
    return res.json({ error: '404 Not Found' });
  } else {
    res.send('404 Not Found');
  }
});

//ErrorHandler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
