let game_data;
				
let current_room = 0;
let items_picked = [];
let command = [];
				
				
				
function terminalOut (info) {
	let terminal = document.getElementById("terminal");
				
	terminal.innerHTML += info;
	terminal.scrollTop = terminal.scrollHeight;
}
			
function findDoorNumber (door) {
	let doors_num = game_data.doors.length;
	console.log(door);
	for (let i = 0; i < doors_num; i++) {
		console.log("Door: ", game_data.doors[i].id);
		if (game_data.doors[i].id == door) {
			return i;
		}
	}
	return -1;
}
				
function findRoomNumber (room) {
	let rooms_num = game_data.rooms.length;
					
	for (let i = 0; i < rooms_num; i++) {
		if (game_data.rooms[i].id == room) {
			return i;
		}
	}
					
	return -1;
}

function findItemNumber (item) {
	for (let i = 0; i < game_data.rooms[current_room].items.length; i++){
		console.log(game_data.rooms[current_room].items[i]);
		if (game_data.rooms[current_room].items[i] == item){
			for(let o = 0; o < game_data.items.length; o++){
				if (game_data.items[o].id == item){
					return o;
				}
			}
		}
	}

	return -1;
}
			
				
function executeCommand () {
	command = document.getElementById("commands").value.trim().split(" ");
	document.getElementById("commands").value = "";
	console.log(command);
					
	if (command.length == 0 || command == "") {
		terminalOut("<p><strong>ERROR:</strong> Escribe una instrucción</p>");
		return;
	}
				
	if (command.length == 1) {
		parseCommand(command[0]);
	}
					
	else {
		parseInstruction(command);
	}
}
				
function parseCommand (command) {
	switch (command) {
					
		case 'ver':
			terminalOut("<p>" + game_data.rooms[current_room].description + "</p>");
			break;
							
		case 'ir':
							
			let doors = "";
			let doors_num = game_data.rooms[current_room].doors.length;
							
			for (let i = 0; i < doors_num; i++) {
				if(i < doors_num - 1){
					doors += game_data.rooms[current_room].doors[i] + ", ";
				} 
				else{
					doors += game_data.rooms[current_room].doors[i];
				}
			}
							
			terminalOut("<p>Puedes ir a: " + doors + "</p>");
							
			break;
							
		case 'coger':
			
			let items = "";
			let items_num = game_data.rooms[current_room].items.length;
			
			for (let i = 0; i < items_num; i++){
				if(i < items_num - 1){
					items += game_data.rooms[current_room].items[i] + ", ";
				}
				else{
					items += game_data.rooms[current_room].items[i];
				}
			}
			
			terminalOut("<p>Los items en la sala son: " + items + "</p>");
			
			break;
			
		case "inventario":
		
			let inventory = "";
			
			if (game_data.inventory.length <= 0){
				terminalOut("<p>No tienes ningun objeto</p>")
			}
			else{
				for(let i = 0; i < game_data.inventory.length; i++){
					if (i < game_data.inventory.length - 1){
						inventory += game_data.inventory[i].id+", ";
					}
					else{
						inventory += game_data.inventory[i].id;
					}
				}
				
				terminalOut("<p>"+inventory+"</p>");
			}
			
			break;
							
		default:
			terminalOut("<p><strong>ERROR:</strong> Comando <strong>" + command + "</strong> no encontrado</p>");
	}
}
			
function parseInstruction (instruction) {
	switch (instruction[0]) {
					
		case 'ver':
			
			let item_number = findItemNumber(instruction[1]);

			if (item_number < 0) {
				console.log("Item erróneo");
				return;
			}
			
			let item_description = game_data.items[item_number].description;
			
			terminalOut("<p><strong>" + instruction[1] + ":</strong> " + item_description + "</p>");
			
			break;
						
		case 'ir':
						
			let door_number = findDoorNumber(instruction[1]);
			console.log("door_number: ",door_number);
			if (door_number < 0) {
				console.log("Puerta errónea");
				return;
			}
							
			let room_number = findRoomNumber(game_data.doors[door_number].rooms[0]);
			let next_room_name = "";
			
			if (room_number == current_room) {
				current_room = findRoomNumber(game_data.doors[door_number].rooms[1]);
			}
			else {
				current_room = room_number;
			}
			
			next_room_name = game_data.rooms[current_room].name
			
			terminalOut("<p>Cambiando de habitación a " + next_room_name + "</p>");
			
			break;
						
		case 'coger':
		
			let item_num = findItemNumber(instruction[1]);
			if (item_num < 0){
				console.log("Item erróneo");
				return;
			}

			if (game_data.items[item_num].pickable == false){
				
				terminalOut("<p>No puedes coger esto</p>");
				return;
			}
						
			
			else{
				game_data.inventory.push({"id": game_data.items[item_num].id});
				for (let i = 0; i < game_data.rooms[current_room].items.length; i++){
					if (game_data.rooms[current_room].items[i] == instruction[1]){
						game_data.rooms[current_room].items.splice(i,1);
					}
				}
			}
			console.log("Item nuevo del inventario: ", game_data.inventory[0].id)


			break;
			
			case "inventario":
			
				let inventoryItem_num = -1;
				for (let i = 0; i < game_data.items.length; i++){
					if (game_data.items[i].id == instruction[1]){
						inventoryItem_num = i;
					}
				}
				if (inventoryItem_num < 0){
					console.log("Item erróneo");
					return;
				}

				terminalOut(game_data.items[inventoryItem_num].description);
				break;


		default:
			terminalOut("<p><strong>ERROR:</strong> Comando <strong>" + instruction[0] + "</strong> no encontrado</p>");
			
			break;
	}
	
}
			
function game (data){
	game_data = data;
					
	terminalOut("<p><strong>¡Bienvenidos a ENTIerrame!</strong> El juego de terror definitivo</p>");
	terminalOut("<p>Te encuentras en " + data.rooms[current_room].name + ". ¿Que quieres hacer?</p>");
}
				
fetch("https://aeren28.github.io/game.json").then(response => response.json()).then(data => game(data));
