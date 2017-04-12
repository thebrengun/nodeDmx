/*
DMX server example
context: node.js

Shows how to use dmx library with an Enttec USB DMX Pro
For more on the library, see https://github.com/wiedi/node-dmx

This is a web server that responds to HTTP GET requests
for /set/channel/level

created 12 April 2017
by Tom Igoe
*/
var express = require('express'); // include the express library
var server = express();           // create a server using express

var DMX = require('dmx');     // include the dmx lib
var dmx = new DMX();          // create a new control instance
var serialPort = '/dev/cu.usbserial-EN192756';  // your serial port name

// create a new DMX universe on your serial port:
var universe = dmx.addUniverse('mySystem',
'enttec-usb-dmx-pro', serialPort);

// turn everything off:
function blackout() {
  for (channel=0; channel < 256; channel++) {
    var light = {[channel]: 0};       // make an object
    universe.update(light);               // set channel to 0
  }
}

function setChannel(request, response) {
  console.log('got a request. channel: ' + request.params.channel
  + ' level: ' + request.params.level);
  var channel = request.params.channel;
  var level = request.params.level;
  universe.update({[channel]:level});               // set channel to 0
  response.end('set ' + channel + ' to ' + level);
}

blackout();
server.use('/',express.static('public'));   // set a static file directory
server.listen(8080);
server.get('/set/:channel/:level', setChannel);

//----------------------------------------------------
// this section makes sure the script turns everything off
// before quitting:

process.stdin.resume();    //make sure the program doesn't close right away

function exitHandler(options, err) {
  if (options.cleanup) console.log('clean');
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
}

// this section is to make sure the lights all dim to 0 when you quit:
function quit(error) {
  if (error) {
    console.log('Uncaught Exception...');
    console.log(error.stack);
  }
  console.log('quitting');
  universe.update({0:0}); // set channel 0 to 0
  process.exit();
}
//Stop the script from quitting before you clean up:
process.stdin.resume();

// catch ctrl+c:
process.on('SIGINT', quit);

//catch uncaught exceptions:
process.on('uncaughtException', quit);
