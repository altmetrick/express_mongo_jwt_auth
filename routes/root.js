const express = require('express');
const router = express.Router();
const path = require('path');

//regex
// '^/$' - '^x' - starts with x ; 'x$' - ends with x
//'x|y' - '|' - or
//'index(.html)?' - '(x)?' - optional
router.get('^/$|index(.html)?', (req, res) => {
  //res.sendFile('./views/index.html', { root: __dirname });
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

//redirect - changes route from /old-page(.html)? to /new-page.html
router.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, '/new-page.html');
});

module.exports = router;
