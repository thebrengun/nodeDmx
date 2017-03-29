/*
DMX example
context: node.js

Shows how to use dmx library with an Enttec USB DMX Pro
For more on the library, see https://github.com/wiedi/node-dmx

based on the demos from the node-dmx repository
created 20 Mar 2017
by Tom Igoe
*/

var DMX = require('dmx');     // include the dmx lib
var dmx = new DMX();          // create a new control instance
var sequence = DMX.Animation; // create a new animation sequence instance
var serialPort = '/dev/cu.usbserial-EN192756';  // your serial port name

// create a new DMX universe on your serial port:
var universe = dmx.addUniverse('mySystem', 'enttec-usb-dmx-pro',
serialPort);

var channel = 0;    // channel number
var level = 0;      // level
var fadeStep = 1;   // increment to fade; for manual fading

// turn everything off:
for (channel=0; channel < 256; channel++) {
  var light = {[channel]: level};      // make an object
  universe.update(light);              // set channel to 0
}
// running a sequence using Animation:
console.log("running a 12-second animation...");
var cue = new sequence();
cue.add({0: 255}, 5000)   // fade channel 0 to 255, 5 seconds
  .delay(2000)          // delay 2 seconds
  .add({0: 0}, 5000)    // fade channel 0 to 0, 5 seconds
  .delay(2000);         // delay 2 seconds
  cue.run(universe, done);  // run the cue, with callback function done

function done() {
  console.log("done. Now I'll run the loop...");
  setInterval(fade, 20);                // run the fade every 20ms
}

// fading a channel manually:
function fade(){
  var light = {[channel]: level};      // make an object
  universe.update(light);              // update the light

  // change the level for next time:
  if (level === 255 || level === 0) {  // if 0 or 255
    fadeStep = -fadeStep;              // reverse the fade direction
    console.log('loop');
  }
  level += fadeStep;                   // increment/decrement the fade
}

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
    console.log(e.stack);
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
