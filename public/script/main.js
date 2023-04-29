//	main.js
const canvas = document.getElementById('mainframe');
var attributes = {};
var gamecontext = {};

function init() {
	canvas.width = 800;
	canvas.height = 500;
	attributes = {
		isAlive: true,
		nick: document.getElementById('name').value,
		color: document.getElementById('color').value,
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height
	}
	console.warn(attributes);
}

function loop() {
	attributes.netID = setInterval(update, 200);
}

function play() {
	init();
	loop();
}

