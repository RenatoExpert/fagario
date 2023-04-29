//	controller.js
document.addEventListener('keydown', event => {
	k = event.keyCode;
	if (k==37) {
		attributes.x = attributes.x - 1.0;
	}
	if (k==38) {
		attributes.y = attributes.y - 1.0;
	}
	if (k==39) {
		attributes.x = attributes.x + 1.0;
	}
	if (k==40) {
		attributes.y = attributes.y + 1.0;
	}
});

