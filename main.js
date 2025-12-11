// FUNCTIONS
function setColorscheme(Name) {
	if (typeof(COLORSCHEMES[Name]) != "string") {
		return console.error(`Invalid theme: ${Name}\nAvailable: ${Object.keys(COLORSCHEMES)}`);
	}
	colorsheme_select.value = Name;
	return css_colorsheme.textContent = COLORSCHEMES[Name];
}

function setBackground(Name) {
	if (typeof(BACKGROUNDS[Name]) != "string") {
		return console.error(`Invalid background: ${Name}\nAvailable: ${Object.keys(BACKGROUNDS)}`);
	}
	background_select.value = Name;
	return body.style.backgroundImage = `url("${BACKGROUNDS[Name]}")`;
}

function switchDesktop(Index) {
	let range = 70;
	body.style.backgroundPositionX = `${Index/4 * range + (100-range)/2}%`;
	return desktop.style.transform = `translateX(${-(Index*100)}vw)`;
}

function oncePerSecond(callback) {
	var timerFunc = function () {
		var now = 1000 * Math.floor(Date.now() / 1000 + 0.1);
		callback(now);
		setTimeout(timerFunc, now + 1000 - Date.now());
	};
	timerFunc();
}

function RandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

// INITIALIZATION	
const body = document.body;
const desktop = document.getElementById("desktop");

const css_colorsheme = document.getElementById("colorscheme");
const colorsheme_select = document.getElementById("colorscheme-select");
const background_select = document.getElementById("background-select");

const time = document.getElementById("time");

// MAIN
oncePerSecond(() => {time.textContent = new Date().toTimeString().slice(0,8)});

for (const name in COLORSCHEMES) {colorsheme_select.insertAdjacentHTML("beforeend",`<option value="${name}">${name}</option>`)}
for (const name in BACKGROUNDS) {background_select.insertAdjacentHTML("beforeend",`<option value="${name}">${name}</option>`)}
setColorscheme(Object.keys(COLORSCHEMES)[RandomInt(0,Object.keys(COLORSCHEMES).length-1)]);
setBackground(Object.keys(BACKGROUNDS)[RandomInt(0,Object.keys(BACKGROUNDS).length-1)]);
colorsheme_select.onchange = () => {setColorscheme(colorsheme_select.value)}
background_select.onchange = () => {setBackground(background_select.value)}

addEventListener("keydown", (event) => {
	if ([1,2,3,4,5].includes(+(event.key)) && !event.repeat) {
		switchDesktop(+(event.key)-1);
	}
})