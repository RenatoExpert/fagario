//	render.js
function render_frame () {
	let qnt = Object.keys(gamecontext).length;
	if(qnt && gamecontext[attributes.nick].isAlive) {
		let cleaner = canvas.getContext('2d');
		cleaner.clearRect(0, 0, canvas.width, canvas.height);	//	Clear
		for(let id in gamecontext) {
			let player = gamecontext[id];
			if (player.isAlive) {
				let sprite = canvas.getContext('2d');
				sprite.beginPath();
				sprite.arc(player.x, player.y, player.size, 0, 2*Math.PI);
				sprite.fillStyle = player.color;
				sprite.fill();
			}
		}
	}
	else if (qnt) {
		banner('GAME OVER');
	} else {
		banner('PRESS PLAY');
	}
	requestAnimationFrame(render_frame);
}
function banner (text) {
	let message = canvas.getContext('2d');
	message.font = "48px serif";
	message.fillText(text, canvas.width/2, canvas.height/2);
}

render_frame();

