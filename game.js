function main() {
	class Board {
		constructor(size) {
			this.size = size;
			this.grid = cleanArray(size);
			this.delayCounter = 0;
			this.delayX = 80;
			this.go = false;
			this.drawErase = false;
			this.frame = 0;
				}
			}
	
	class Canvas {
		constructor(id) {
			this.canvas = document.getElementById(id);
			this.ctx = this.canvas.getContext("2d");
			this.drawing = false;
		}
	}


	var mainCanvas = new Canvas("myCanvas");
	var sliderCanvas = new Canvas("mySlider");
	var myBoard = new Board(30);
	var drawing = false;
	var buttonClick = document.getElementsByClassName("button");


	//handles clicks on main canvas, finds them and switches board
	mainCanvas.canvas.addEventListener("mouseup", function() {mainCanvas.drawing = false;});
	mainCanvas.canvas.addEventListener("mousedown", function(event) {
		mainCanvas.drawing = true;
		myBoard.drawErase = handleDrawErase(mainCanvas, myBoard, event);
		myBoard.grid = mouseClick(mainCanvas, myBoard, event);
	});
	mainCanvas.canvas.addEventListener("mousemove", function(event) {
		if(mainCanvas.drawing) {
			myBoard.grid = handleMouse(mainCanvas, myBoard, event);
		}
	});
	mainCanvas.canvas.addEventListener("mouseout", function() {
		mainCanvas.drawing = false;
	});
	
	//handles clicks on slider
	sliderCanvas.canvas.addEventListener("mouseup", function() {sliderCanvas.drawing = false;});
	sliderCanvas.canvas.addEventListener("mousedown", function(event) {
		sliderCanvas.drawing = true;
		myBoard.delayX = sliderClick(sliderCanvas, myBoard, event);
		drawSlider(sliderCanvas, myBoard.delayX);
	});
	sliderCanvas.canvas.addEventListener("mousemove", function(event) {
		if(sliderCanvas.drawing) {
			myBoard.delayX = sliderClick(sliderCanvas, myBoard, event);
		}
 	})
	sliderCanvas.canvas.addEventListener("mouseout", function() {
		sliderCanvas.drawing = false;
	});
	;

	//button handler
	for(i = 0; i < buttonClick.length; i++) {
		buttonClick[i].addEventListener("click", function(event){
		myBoard = handleButtton(event.target, myBoard);
	})
	}

	//draw on each cycle
	setInterval( function() {
		myBoard = handleInterval(mainCanvas, sliderCanvas, myBoard);
		}, 5);
	}

function handleMouse(mainCanvas, myBoard, event) {
	var rect = mainCanvas.canvas.getBoundingClientRect();
	coords = {
		x : Math.floor((event.clientX - rect.left) / 16),
		y : Math.floor((event.clientY - rect.top) / 16)
	}


	//myBoard.grid[coords.y][coords.x] = !myBoard.grid[coords.y][coords.x];
	if (coords.x >= 0 && coords.x < myBoard.size && coords.y >= 0 && coords.y < myBoard.size) {
		myBoard.grid[coords.y][coords.x] = myBoard.drawErase;
	}
	
	
	return myBoard.grid;
}

function mouseClick(mainCanvas, myBoard, event) {
	var rect = mainCanvas.canvas.getBoundingClientRect();

	coords = {
		x : Math.floor((event.clientX - rect.left) / 16),
		y : Math.floor((event.clientY - rect.top) / 16)
	}
	
	if (coords.x >= 0 && coords.x < myBoard.size && coords.y >= 0 && coords.y < myBoard.size) {
		myBoard.grid[coords.y][coords.x] = !myBoard.grid[coords.y][coords.x];
	}
	return myBoard.grid;
}

function sliderClick(sliderCanvas, myBoard, event) {
	var rect = sliderCanvas.canvas.getBoundingClientRect();
	
	x = (event.clientX - rect.left);
	
	if (x >= 0 && x < sliderCanvas.canvas.width) {
		myBoard.delayX = Math.floor(x);

	}
	return myBoard.delayX
}

function handleDrawErase(mainCanvas, myBoard, event) {
	var rect = mainCanvas.canvas.getBoundingClientRect();
	coords = {
		x : Math.floor((event.clientX - rect.left) / 16),
		y : Math.floor((event.clientY - rect.top) / 16)
	}
	
	if (coords.x >= 0 && coords.x < myBoard.size && coords.y >= 0 && coords.y < myBoard.size) {
		return !myBoard.grid[coords.y][coords.x];
		
	} else {
		return myBoard.drawErase;
	}
}

function handleButtton(current, myBoard) {
	if (current == start) {

		if (myBoard.go) { 
			document.getElementById(current.id).innerHTML = "Unpause";
		}	else { 
			document.getElementById(current.id).innerHTML = "Pause";
		}

		myBoard.go = !myBoard.go;
	}

	else if (current == clear) {
		myBoard.grid = cleanArray(myBoard.size);
		myBoard.frame = 0;
		document.getElementById("start").innerHTML = "Start";
		myBoard.go = false;
		document.getElementById("frame").innerHTML = "Frame: 0";
	}

	else if(current == resize) {
		myBoard = resizeBoard(myBoard);
		document.getElementById("start").innerHTML = "Start";
		myBoard.go = false;
		document.getElementById("frame").innerHTML = "Frame: 0";
	}

	return myBoard;
} 

function handleInterval (mainCanvas, sliderCanvas, myBoard) {
	drawBorder(mainCanvas);
	drawCoords(mainCanvas, myBoard);
	drawSlider(sliderCanvas, myBoard.delayX);
	
	if (myBoard.go) {
		myBoard.delayCounter++;
		
		if (myBoard.delayCounter > (151 - myBoard.delayX)) {
			myBoard.frame++
			document.getElementById("frame").innerHTML = ("Frame: " + myBoard.frame);
			myBoard.delayCounter = 0;

			if(document.getElementById("yesWrap").checked) {
				myBoard = nextBoardWrap(myBoard);
			} else {
				myBoard = nextBoardNoWrap(myBoard);
			}
			
		}
		
	}

	return myBoard;;
}

function drawSlider(sliderCanvas, x) {
	sliderCanvas.ctx.fillStyle = "#000";
	sliderCanvas.ctx.fillRect(0, 0, sliderCanvas.canvas.width, sliderCanvas.canvas.height);
	
	sliderCanvas.ctx.fillStyle = "#CCC";
	sliderCanvas.ctx.beginPath();
	sliderCanvas.ctx.moveTo(0, 0);
	sliderCanvas.ctx.lineTo(0, sliderCanvas.canvas.height - 10);
	sliderCanvas.ctx.lineTo(sliderCanvas.canvas.width, 5);
	sliderCanvas.ctx.lineTo(sliderCanvas.canvas.width, 0);
	sliderCanvas.ctx.fill();
	
	sliderCanvas.ctx.beginPath();
	sliderCanvas.ctx.moveTo(x, 0);
	sliderCanvas.ctx.lineTo(x, sliderCanvas.canvas.height);
	sliderCanvas.ctx.lineWidth = 5;
	sliderCanvas.ctx.strokeStyle = "#F00";
	sliderCanvas.ctx.stroke();
}

function drawBorder(mainCanvas) {
	mainCanvas.ctx.fillStyle = "#FFF";
	mainCanvas.ctx.fillRect(0, 0, mainCanvas.canvas.width, mainCanvas.canvas.height);
	mainCanvas.ctx.strokeStyle = "#333";
	mainCanvas.ctx.lineWidth = 1;

	//draw grid
	for(var xy = 1; xy <= mainCanvas.canvas.width; xy += 16) {
		//alert("This");
		mainCanvas.ctx.beginPath();
		mainCanvas.ctx.moveTo(xy, 0);
		mainCanvas.ctx.lineTo(xy, mainCanvas.canvas.height);
		mainCanvas.ctx.stroke();
		mainCanvas.ctx.beginPath();
		mainCanvas.ctx.moveTo(0, xy);
		mainCanvas.ctx.lineTo(mainCanvas.canvas.width, xy);
		mainCanvas.ctx.stroke();
	}
}

function drawCoords(mainCanvas, myBoard) {
	var size = myBoard.size;
	//draw squares for each true in grid
	mainCanvas.ctx.fillStyle = "#E80";

	for (y = 0; y < size; y ++) {
		for (x = 0; x < size; x ++) {
			if (myBoard.grid[y][x] == true) {
				var drawX = 16 * x;
				var drawY = 16 * y;
				mainCanvas.ctx.fillRect(drawX + 2, drawY + 2, 14, 14);
			}
		}
	}
}

function cleanArray(size) {
	var newGrid = [];
	for (y = 0; y < size; y ++) {
		newGrid.push([]);
		for (x = 0; x < size; x ++) {
			newGrid[y].push(false);
		}
	}

	return newGrid;
}

function resizeBoard(myBoard) {
	var canvas = document.getElementById("myCanvas");
	var size = Number(prompt("What size?"));
	
	while (isNaN(size) || size < 1) {
		size = Number(prompt("Please enter a number greater than 0."));
	}

	canvas.width = (16 * size) + 2;
	canvas.height = (16 * size) + 2;
	myBoard.size = size;
	myBoard.grid = cleanArray(size);
	myBoard.frame = 0;
	return myBoard;
}

function nextBoardWrap(myBoard) {
	var size = myBoard.size;
	var adj = 0;
	var newGrid = cleanArray(size);
	var topCheck;
	var bottomCheck;
	var leftCheck;
	var rightCheck;


	for (y = 0; y < size; y ++) {
		for (x = 0; x < size; x ++) {
			adj = 0;
			//check all adjacents for each and set new board

			if (y > 0) { topCheck = y - 1;}
			else {topCheck = size - 1;}
			if (y < size - 1) { bottomCheck = y + 1;}
			else {bottomCheck = 0;}
			
			if (x > 0) { leftCheck = x - 1;}
			else {leftCheck = size - 1;}
			if (x < size - 1) { rightCheck = x + 1;}
			else {rightCheck = 0;}
			
			if (myBoard.grid[topCheck][leftCheck]) {adj++;}
			if (myBoard.grid[topCheck][x]) {adj++;}
			if (myBoard.grid[topCheck][rightCheck]) {adj++;}
			if (myBoard.grid[y][leftCheck]) {adj++;}
			if (myBoard.grid[y][rightCheck]) {adj++;}
			if (myBoard.grid[bottomCheck][leftCheck]) {adj++;}
			if (myBoard.grid[bottomCheck][x]) {adj++;}
			if (myBoard.grid[bottomCheck][rightCheck]) {adj++;}

			//adjust newboard accordingingly seperated for easier read
			//any live cell with 2/3 neighbors survives
			if (myBoard.grid[y][x] && adj > 1 && adj < 4) {
				//alert("survice");
				newGrid[y][x] = true;
			}
			//dead cell with 3 neighbors revives
			if (myBoard.grid[y][x] == false && adj == 3) {
				newGrid[y][x] = true;
			}

		}
	}

	//newGrid[1][1] = true;
	myBoard.grid = newGrid;
	return myBoard;
}
				
function nextBoardNoWrap(myBoard) {
	var size = myBoard.size;
	var adj = 0;
	var newGrid = cleanArray(size);


	for (y = 0; y < size; y ++) {
		for (x = 0; x < size; x ++) {
			adj = 0;
			//check all adjacents for each and set new board

			if (y > 0) {
				//top
				if (myBoard.grid[y - 1][x]) {
					adj++;
				}

				//top left
				if (x > 0 && myBoard.grid[y - 1][x - 1]) {
				adj++;
				}

				//top right
				if (x < size - 1 && myBoard.grid[y - 1][x + 1]) {
				adj++;
				}

			}
			//below
			if (y < size - 1) {
				//bottom
				if (myBoard.grid[y + 1][x]) {
					adj++;
				}

				//bottom left
				if (x > 0 && myBoard.grid[y + 1][x - 1]) {
				adj++;
				}

				//bottom right
				if (x < size - 1 && myBoard.grid[y + 1][x + 1]) {
				adj++;
				}
			}
			//left
			if (x > 0 && myBoard.grid[y][x - 1]) {
				adj++;
			}
			//right
			if (x < size - 1 && myBoard.grid[y][x + 1]) {
				adj++;
			}

			//adjust newboard accordingingly seperated for easier read
			//any live cell with 2/3 neighbors survives
			if (myBoard.grid[y][x] && adj > 1 && adj < 4) {
				newGrid[y][x] = true;
			}
			//dead cell with 3 neighbors revives
			if (myBoard.grid[y][x] == false && adj == 3) {
				newGrid[y][x] = true;
			}

		}
	}

	myBoard.grid = newGrid;
	return myBoard;
}
main();