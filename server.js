const express = require('express');
const path = require('path');
const cors = require('cors');

const { logger } = require('./middleware/logEvents');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');

const rootRouter = require('./routes/root');
const registerRouter = require('./routes/register');
const authRouter = require('./routes/auth');
const employeesRouter = require('./routes/employees');

const app = express();

//custom middleware
app.use(logger);
//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
