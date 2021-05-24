const form = document.getElementById('form');
const outputElement = document.getElementById('output');
const outputErrorsElement = document.getElementById('output-errors');
const clearElement = document.getElementById('clear');

form.addEventListener("submit", event => {
  event.preventDefault();
	sendData();
});

const sendData = () => {
	const inputData = form['inputData'].value.split('\n');
	let result = [];
	let errors = [];

	if (inputData.length <= 0) {
		errors.push('Please enter data');
	}
	// Get maximal grid values
	const maxX = parseFloat(inputData[0].split(' ')[0]);
	const maxY = parseFloat(inputData[0].split(' ')[1]);
	if (!Number.isInteger(maxX) || maxX <= 0 || !Number.isInteger(maxY) || maxY <= 0) {
		errors.push('The maximum x and y coordinates of the grid must be integer numbers greater than zero.');
	}

	// Get rovers data
	inputData.shift();

	// separation of data concerning the position and movements of rovers
	let positions = [];
	let movements = [];
	inputData.forEach((value, index) => {
		if (index % 2 === 0) {
			positions.push(value);
		} else {
			movements.push(value);
		}
	});

	// Movement execution when positions and movements indexes are the same
	positions.forEach((position, positionIndex) => {
		movements.forEach((movement, movementIndex) => {
			if(positionIndex === movementIndex) {
				// initial rover x position
				let x = parseFloat(position.split(' ')[0], 10) ;
				//initial rover y position
				let y = parseFloat(position.split(' ')[1], 10);
				//initial rover orientation
				let orientation = position.split(' ')[2].toUpperCase();

				if (!Number.isInteger(x) || x < 0 || x > maxX) {
					errors.push(['The x coordinate of rover', positionIndex + 1, 'must be an integer between 0 and', maxX].join(' '));
				}
				if (!Number.isInteger(y) || y < 0 || y > maxY) {
					errors.push(['The y coordinate of rover', positionIndex + 1, 'must be an integer between 0 and', maxY].join(' '));
				}
				if(orientation !== 'N' && orientation !== 'S' && orientation !== 'E' && orientation !== 'W') {
					errors.push(['Undefined character for rover ', movementIndex + 1, ' orientation. Please enter N, O, S or E value'].join(' '));
				}

				movement.split('').forEach((currentMovement) => {
					const moveRover = () => {
						switch (orientation) {
							case 'N':
								// the rover must stay inside the grid
								if (y + 1 <= maxY) {
									y = y + 1;
								}
								break;
							case 'S':
								// the rover must stay inside the grid
								if (y - 1 >= 0) {
									y = y - 1;
								}
								break;
							case 'E':
								// the rover must stay inside the grid
								if (x + 1 <= maxX) {
									x = x + 1;
								}
								break;
							case 'W':
								// the rover must stay inside the grid
								if (x - 1 >= 0) {
									x = x - 1;
								}
								break;
							default:
							return;
						}
					}

					const turnLeft = () => {
						switch (orientation) {
							case 'N':
								orientation = 'W';
								break;
							case 'S':
								orientation = 'E';
								break;
							case 'E':
								orientation = 'N';
								break;
							case 'W':
								orientation = 'S';
								break;
							default:
								return;
						}
					}
					const turnRight = () => {
						switch (orientation) {
							case 'N':
								orientation = 'E';
								break;
							case 'S':
								orientation = 'W';
								break;
							case 'E':
								orientation = 'S';
								break;
							case 'W':
								orientation = 'N';
								break;
							default:
								return;
						}
					}

					switch (currentMovement.toUpperCase()) {
						case 'M' :
							moveRover();
							break;
						case 'L' :
							turnLeft();
							break;
						case 'R' :
							turnRight();
							break;
						default:
							errors.push(['Undefined movement ', currentMovement,' for the rover ', movementIndex + 1, '. Please enter M, L or R'].join(' '));
					}

				})
				result.push([x, y, orientation].join(' '));
			}
		})
	})

	if(errors.length > 0) {
		errors.forEach((error) => {
			const outputData = document.createElement('div');
			outputData.textContent = error;
			outputData.classList.add('output__content');
			outputData.classList.add('output__content--errors');
			outputErrorsElement.appendChild(outputData);
		})
	} else {
		result.forEach((element) => {
			const outputData = document.createElement('div');
			outputData.textContent = element;
			outputData.classList.add('output__content');
			outputElement.appendChild(outputData);
		})
	}
}

clearElement.addEventListener("click", () => {
	outputElement.innerHTML = '';
	outputErrorsElement.innerHTML = '';
	form['inputData'].value = '';
});
