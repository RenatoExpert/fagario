const fs = require('fs').promises;
const http = require('http');

const host = 'localhost';
const port = 8888;

var game_status = {};
var dead = {};

const table_size = 300;
let food_counter = 0;
function calculate_size (points) {
	let result = (points/Math.PI)*0.5;
	console.log({
		points: points,
		result: result
	});
	return result;
}

function generate_food () {
	console.debug('generating food');
	let food = {
		nick: 'food',
		isAlive: true,
		points: 10,
		x: Math.random() * table_size,
		y: Math.random() * table_size,
		color: 'pink'
	};
	food.size = calculate_size(food.points);
	game_status[food_counter] = food;
	food_counter++;
	console.debug('made food', game_status);
}
setInterval(generate_food, 5000);

function eat_player (eater, killed) { 
	console.warn('EAT');
	eater.points += killed.points;
	eater.points += 1;
	eater.size = calculate_size(eater.points);
	killed.isAlive = false;
	dead[killed.nick] = killed.netID;
}

function measure_distance (ax, ay, bx, by) {
	let x = bx - ax;
	let y = by - ay;
	let distance = (x**2 + y**2)**0.5
	/*
	console.log({
		distance: distance,
		xy: [x, y],
		input: [ax, ay, bx, by]
	});
	*/
	return distance;
}

function check_collision () {
	//console.debug('checking for collision');
	if (Object.keys(game_status).length > 1) {
		for (let id1 in game_status) {
			for (let id2 in game_status) {
				if (id1 != id2) {
					//console.log('Comparing...', id1, id2);
					let player1 = game_status[id1];
					let player2 = game_status[id2];
					if (player1.isAlive && player2.isAlive) {
						let distance = measure_distance(player1.x, player1.y, player2.x, player2.y);
						if (distance < player1.size && player1.size > player2.size) {
							eat_player (player1, player2);
						} else {
							//console.log('no collision');
						}
					}
				}
			}
		}
	} else {
		console.log('No enough objects');
	}
}

function new_player(player_info) {
	player_info.points = (Math.random() * 90) + 10;
	player_info.size = calculate_size(player_info.points);
	game_status[player_info.nick] = player_info;
	console.log("new player", game_status[player_info.nick]);
}

const server = http.createServer((req, res) => {
	if (req.method == 'POST') {
		//console.log('player activity');
		let player_info = JSON.parse(
			decodeURI(req.url).substring(1)
		);
		if (dead[player_info.nick] >= player_info.netID) {
			//	ignore
		} else {
			if (game_status.hasOwnProperty(player_info.nick)) {
				if (game_status[player_info.nick].isAlive) {
					//	Active player
					game_status[player_info.nick].x = player_info.x; 
					game_status[player_info.nick].y = player_info.y; 
					//game_status[player_info.nick] = player_info;
				} else {
					//	Respawn
					new_player(player_info);
				}
			} else {
				//	New player
				new_player(player_info);
			}
			check_collision();
		}
		response = JSON.stringify(game_status);
		res.end(response);
	} else {
		//	Serving files
		const url = req.url == '/' ? '/index.html' : req.url;
		console.log('Request a file:', url);
		fs.readFile(__dirname + '/public' + url).then(contents => {
			res.setHeader("Content-Type", "text/html");
			res.writeHead(200);
			res.end(contents);
		}).catch(message => {
			console.error('File not found', url, message);
		});
	}
});

server.listen(port, host, () => {
	console.log(`Http server is running at ${host}:${port}`);
});

