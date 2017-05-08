var url = '/set';			// the ropute to set a DMX channel in the server
var responseDiv;			// the div where the server response goes
var channelCount = 1;
var spacing = 40;								// spacing between sliders
var channelsInUse = [0, 12, 16, 24, 36, 42];
var channelNames = ['front SL', 'front SR', 'front SR 2', 'back', 'ITP sign', 'area SL'];
function setup() {
	noCanvas();				// no canvas
	makeDimmers(15);  // make 15 dmx channel sliders
}

function makeDimmers(dimmerCount) {
	// make the response div so you have somewhere to put server responses:
	responseDiv = createDiv('server response goes here');
	responseDiv.position(10,10);

// make a div to put the channel sliders in:
	var dimmerDiv = createDiv();
	dimmerDiv.html('');							// make it blank initially
	dimmerDiv.position(10,40);			// position below responseDiv

	// iterate over the number of channels wanted:
	for (var x=0; x< channelsInUse.length; x++) {
		createDimmer(channelsInUse[x], dimmerDiv, channelNames[x]);
	}

	//masterFader(dimmerDiv);
}

function createDimmer(d, parentDiv, myName) {
	var dimmer = createSlider(0, 255, 0);					// make a slider
	// dimmer.id('channel' + d);												// id = 'channel0', etc.
	parentDiv.child(dimmer);											// add it to dimmerDiv
	dimmer.style('transform', 'rotate(270deg)');  // rotate vertical
	dimmer.position(spacing * channelCount , 160);						// move it over horizontally
	dimmer.changed(fade);													// set a callback function
	dimmer.addClass(d);														// channel number = class
	var channelNum = createP(myName);									// make a channel num label
	channelNum.style('text-align', 'center')			// align text
	parentDiv.child(channelNum);									// add to dimmerDiv
	channelNum.position(spacing * (channelCount+1.5), 0);			// move it over

	var channelLevel = createInput(dimmer.value());	// make a channel level label
	channelLevel.style('text-align', 'center')			// align text
	channelLevel.size(30, 16);											// size for box
	channelLevel.changed(fade);											// add callback
	channelLevel.addClass(d);												// channel number = class
	parentDiv.child(channelLevel);									// add it to dimmerDiv
	channelLevel.position(spacing * (channelCount+1.25), 80);	// move it over horizontally
channelCount++;
}

function masterFader(parentDiv) {
	var dimmer = createSlider(0, 255, 0);					// make a slider
	parentDiv.child(dimmer);											// add it to dimmerDiv
	dimmer.style('transform', 'rotate(270deg)');  // rotate vertical
	dimmer.position(0 , 160);						// move it over horizontally
	dimmer.changed(fadeAll);													// set a callback function
	dimmer.addClass(0);														// channel number = class
	var channelNum = createP('master');									// make a channel num label
	channelNum.style('text-align', 'center')			// align text
	parentDiv.child(channelNum);									// add to dimmerDiv
	channelNum.position(spacing * (channelCount+1.5), 0);			// move it over

	var channelLevel = createInput(dimmer.value());	// make a channel level label
	channelLevel.style('text-align', 'center')			// align text
	channelLevel.size(30, 16);											// size for box
	channelLevel.changed(fade);											// add callback
	channelLevel.addClass(d);												// channel number = class
	parentDiv.child(channelLevel);									// add it to dimmerDiv
	channelLevel.position(spacing * (channelCount+1.25), 80);	// move it over horizontally

}

function fade(thisChannel) {
	var inputClass;
	var thisLevel;
	console.log(thisChannel);
	if (!thisChannel) {
		 inputClass = '.' + this.class();		// name starts with #channel0, e.g.
	} else {
		inputClass = '.' + thisChannel;		  // name starts with #channel0, e.g.
	}
// get the name of this input so you can set its partner:
var items = selectAll(inputClass);
for (var i in items) {
	console.log(items[i].value());
	items[i].value(this.value());
}

	// format an HTTP request: /set/channel/level
	var parameters = '/' + this.class();					// add channel number
	parameters += '/' + this.value();								// add level
	console.log(parameters);
	httpGet(url + parameters, 'text', showResponse); // make HTTP call
}

function fadeAll(masterLevel) {
	for (var x=0; x< channelsInUse.length; x++) {
	 fade(channelsInUse[x]);
	}
}

// this is the callback for the HTTP request
function showResponse(data) {
	responseDiv.html(data);			// put the response in responseDiv
}
