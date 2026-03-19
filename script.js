let array = [];
let barElements = [];

// Get DOM elements
const form = document.getElementById("form");
const algorithmSelect = document.getElementById("sorting-algorithm");
const arraySizeInput = document.getElementById("array-size");
const arraySizeValue = document.getElementById("array-size-num");
const speedInput = document.getElementById("animation-speed");
const speedValue = document.getElementById("animation-speed-num");
const randomizeButton = document.getElementById("randomize-array");
const submitButton = document.getElementById("submit-button");
const arrayContainer = document.getElementById("array-container");

window.addEventListener("load", () => {
	generateArray(parseInt(arraySizeInput.value));
	arraySizeValue.textContent = arraySizeInput.value;
	speedValue.textContent = speedInput.value;
});

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const algorithm = algorithmSelect.value;
});

randomizeButton.addEventListener("click", () => {
	const size = parseInt(arraySizeInput.value);
	generateArray(size);
});

arraySizeInput.addEventListener("input", () => {
	const size = parseInt(arraySizeInput.value);
	arraySizeValue.textContent = size;
	generateArray(size);
});

speedInput.addEventListener("input", () => {
	speedValue.textContent = speedInput.value;
});

function generateArray(size) {
	array = [];
	for (let i = 0; i < size; i++) {
		array[i] =
			Math.floor(Math.random() * (arrayContainer.clientHeight * 0.95)) + 1;
	}
	return renderArray(array);
}

function renderArray(array) {
	barElements = [];
	arrayContainer.innerHTML = "";
	array.forEach((value) => {
		const bar = document.createElement("div");
		bar.classList.add("bar");
		bar.style.height = `${value}px`;
		bar.style.width = `${arrayContainer.clientWidth / array.length - 1}px`; // Adjust width based on array size
		arrayContainer.appendChild(bar);
		barElements.push(bar);
	});
}
