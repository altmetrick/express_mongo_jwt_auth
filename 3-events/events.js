const logEvents = require('./logEvents');

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

//initialize an object
const myEmitter = new MyEmitter();

//adding listener on 'log' event
myEmitter.on('log', (msg) => {
  logEvents(msg);
});
myEmitter.on('hello', (msg) => {
  console.log(msg);
});

setTimeout(() => {
  myEmitter.emit('log', 'hello log');
}, 2000);
