const whiteList = [
  'https://your-domain-that-will-be-using-this-backend-app.com',
  'http://localhost:3000(for react app)',
  undefined,
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`origin: ${origin} not allowed by CORS`));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
