//	network.js
const serverURL = 'http://localhost:8888';
function update () {
	if(attributes.isAlive) { 
		socket = new XMLHttpRequest();
		reqURL = serverURL + '/' + JSON.stringify(attributes);
		socket.open("POST", reqURL, false);
		socket.send('hello');
		let response = socket.responseText;
		gamecontext = JSON.parse(response);
	} else {
		clearInterval(attributes.netID);
	}
}

