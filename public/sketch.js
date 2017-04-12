var url = '/set';			// the ropute to set a DMX channel in the server
var responseDiv;			// the div where the server response goes

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
	var spacing = 30;								// spacing between sliders

	// iterate over the number of channels wanted:
	for (var d=0; d < dimmerCount; d++) {
		var dimmer = createSlider(0, 255, 0);					// make a slider
		dimmer.id('channel'+d);												// id = 'channel0', etc.
		dimmerDiv.child(dimmer);											// add it to dimmerDiv
		dimmer.style('transform', 'rotate(270deg)');  // rotate vertical
		dimmer.position(spacing * d , 120);						// move it over horizontally
		dimmer.changed(fade);													// set a callback function
		var channelNum = createP(d);									// make a channel num label
		channelNum.style('text-align', 'center')			// align text
		channelNum.id('channel'+ d + 'label');				// id = 'channel0label' etc.
		dimmerDiv.child(channelNum);									// add to dimmerDiv
		channelNum.position(spacing * (d+2), 0);			// move it over

		var channelLevel = createP(dimmer.value());		// make a channel level label
		channelLevel.style('text-align', 'center')
		channelLevel.id('channel'+ d + 'level');			// id = 'channel0level' etc.
		dimmerDiv.child(channelLevel);								// add it to dimmerDiv
		channelLevel.position(spacing * (d+2), 20);	  // move it over horizontally
	}
}

function fade() {
	// get the right level label and set its text:
	var thisLabel = document.getElementById(this.id() + 'level');
	thisLabel.innerHTML = this.value();

	// format an HTTP request: /set/channel/level
	// this.id = channel0, for example, so take substring from the 7th character:
	var parameters = '/' + this.id().substring(7);	// add channel
	parameters += '/' + this.value();								// add level
	httpGet(url + parameters, 'text', showResponse); // make HTTP call
}

// this is the callback for the HTTP request
function showResponse(data) {
	responseDiv.html(data);			// put the response in responseDiv
}
