let array = [];
let barElements = [];
let isSorted = false;
let isSorting = false;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let timerInterval;

// Get DOM elements
const form = document.getElementById("form");
const algorithmSelect = document.getElementById("sorting-algorithm");
const arraySizeInput = document.getElementById("array-size");
const arraySizeValue = document.getElementById("array-size-num");
const speedInput = document.getElementById("animation-speed");
const speedValue = document.getElementById("animation-speed-num");
const randomizeButton = document.getElementById("randomize-array");
const submitButton = document.getElementById("submit-button");
const timer = document.getElementById("timer");
const arrayContainer = document.getElementById("array-container");

window.addEventListener("load", () => {
	generateArray(parseInt(arraySizeInput.value));
	arraySizeValue.textContent = arraySizeInput.value;
	speedValue.textContent = speedInput.value;
	resetTimer();
});
window.addEventListener("resize", () => {
	renderArray(array);
});

form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const algorithm = algorithmSelect.value;
	if (!isSorted && !isSorting) {
		startSort();
		if (algorithm === "bubble") {
			await bubbleSort();
		} else if (algorithm === "selection") {
			await selectionSort();
		} else if (algorithm === "insertion") {
			await insertionSort();
		}
		stopSort();
	} else {
		resetTimer();
		isSorting = false;
		return;
	}
});

randomizeButton.addEventListener("click", () => {
	const size = parseInt(arraySizeInput.value);
	resetTimer();
	generateArray(size);
});

arraySizeInput.addEventListener("input", () => {
	const size = parseInt(arraySizeInput.value);
	arraySizeValue.textContent = size;
	resetTimer();
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
	isSorted = false;
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

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function swap(i, j) {
	removeHighlight(i, j, "bar-comparing");
	highlightBars(i, j, "bar-swapping");
	// Swap values in the array
	[array[i], array[j]] = [array[j], array[i]];
	// Swap heights of the corresponding bars
	const tempHeight = barElements[i].style.height;
	barElements[i].style.height = barElements[j].style.height;
	barElements[j].style.height = tempHeight;
}

function highlightBars(i, j, className) {
	barElements[i].classList.add(className);
	barElements[j].classList.add(className);
}

function removeHighlight(i, j, className) {
	barElements[i].classList.remove(className);
	barElements[j].classList.remove(className);
}

function markSorted(i) {
	barElements[i].classList.add("bar-sorted");
}

function getSpeed() {
	return 105 - parseInt(speedInput.value) * 20;
}

function playTone(value) {
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();

	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);

	oscillator.type = "sine";
	oscillator.frequency.value = value;
	gainNode.gain.value = 0.1;

	oscillator.start();
	oscillator.stop(audioContext.currentTime + 0.05);
}

function formatTime(elapsed) {
	const minutes = Math.floor(elapsed / 60000);
	const seconds = Math.floor((elapsed % 60000) / 1000);
	const centiseconds = Math.floor((elapsed % 1000) / 10);
	if (minutes > 0) {
		return `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}m`;
	}
	return `${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}s`;
}

function resetTimer() {
	clearInterval(timerInterval);
	timer.textContent = formatTime(0);
}

function startSort() {
	resetTimer();
	const startTime = Date.now();
	timerInterval = setInterval(() => {
		timer.textContent = formatTime(Date.now() - startTime);
	}, 10);
	audioContext.resume();
	submitButton.textContent = "Stop and Reset";
	submitButton.style.backgroundColor = "var(--btn-stop)";
	randomizeButton.disabled = true;
	arraySizeInput.disabled = true;
	algorithmSelect.disabled = true;
	isSorting = true;
}

function stopSort() {
	submitButton.textContent = "Sort";
	submitButton.style.backgroundColor = "var(--btn)";
	randomizeButton.disabled = false;
	arraySizeInput.disabled = false;
	algorithmSelect.disabled = false;
	isSorting = false;
}

async function bubbleSort() {
	if (isSorted) return;
	let n = array.length;
	for (let i = 0; i < n - 1; i++) {
		for (let j = 0; j < n - i - 1; j++) {
			if (!isSorting) {
				stopSort();
				generateArray(parseInt(arraySizeInput.value));
				return;
			}
			highlightBars(j, j + 1, "bar-comparing");
			playTone(200 + (array[j] / arrayContainer.clientHeight) * 850);
			await sleep(getSpeed());
			if (array[j] > array[j + 1]) {
				swap(j, j + 1);
			} else {
				removeHighlight(j, j + 1, "bar-comparing");
			}
			await sleep(getSpeed());
			removeHighlight(j, j + 1, "bar-swapping");
		}
		markSorted(n - 1 - i);
	}
	markSorted(0);
	clearInterval(timerInterval);
	for (let k = 0; k < n; k++) {
		barElements[k].classList.remove(
			"bar-comparing",
			"bar-swapping",
			"bar-sorted",
		);
		playTone(200 + (array[k] / arrayContainer.clientHeight) * 850);
		await sleep(50);
		markSorted(k);
	}
	isSorted = true;
}

async function selectionSort() {
	if (isSorted) return;
	let n = array.length;
	let min;
	for (let i = 0; i < n - 1; ++i) {
		min = i;
		for (let j = i + 1; j < n; j++) {
			if (!isSorting) {
				stopSort();
				generateArray(parseInt(arraySizeInput.value));
				return;
			}
			highlightBars(j, min, "bar-comparing");
			playTone(200 + (array[j] / arrayContainer.clientHeight) * 850);
			await sleep(getSpeed());
			removeHighlight(j, min, "bar-comparing");
			if (array[j] < array[min]) {
				min = j;
			}
		}
		if (min !== i) {
			swap(i, min);
			await sleep(getSpeed() * 2);
			removeHighlight(i, min, "bar-swapping");
		} else {
			removeHighlight(i, min, "bar-comparing");
		}
		markSorted(i);
	}
	markSorted(n - 1);
	clearInterval(timerInterval);
	for (let k = 0; k < n; k++) {
		barElements[k].classList.remove(
			"bar-comparing",
			"bar-swapping",
			"bar-sorted",
		);
		playTone(200 + (array[k] / arrayContainer.clientHeight) * 850);
		await sleep(50);
		markSorted(k);
	}
	isSorted = true;
}

async function insertionSort() {
	if (isSorted) return;
	let n = array.length;

	for (let i = 1; i < n; i++) {
		let key = array[i];
		let j = i - 1;

		while (j >= 0 && array[j] > key) {
			if (!isSorting) {
				stopSort();
				generateArray(parseInt(arraySizeInput.value));
				return;
			}
			highlightBars(j, j + 1, "bar-comparing");
			playTone(200 + (array[j] / arrayContainer.clientHeight) * 850);
			await sleep(getSpeed());
			swap(j, j + 1);
			await sleep(getSpeed());
			removeHighlight(j, j + 1, "bar-swapping");
			j--;
		}
	}
	clearInterval(timerInterval);
	for (let k = 0; k < n; k++) {
		markSorted(k);
		playTone(200 + (array[k] / arrayContainer.clientHeight) * 850);
		await sleep(25);
	}
	isSorted = true;
}
