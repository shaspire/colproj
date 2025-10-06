const audScan = new Audio("./scanning.ogg");
const audBeep = new Audio("./twobeep.ogg");
const audLight = new Audio("./light_tube_on.ogg");
const audDenied = new Audio("./deniedbeep.ogg");
const loginForm = document.getElementById("login-form");
const uname = document.getElementById("uname");
const bcode = document.getElementById("bcode");
const submit= document.getElementById("submit");

getCookie("user") != "" ? location.replace("/account/"): false;

function fakeHash() {
	let result = '';
	let characters = '0123456789ABCDEF';
	let charactersLength = characters.length;
	for ( let i = 0; i < 6; i++ ) {
		for ( let i = 0; i < 8; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		i == 2 || i == 5 ? result += " " : result+= "-";
	}
	return result;
}

function checkValidity() {
	if (uname.value == "" || document.getElementById("hash") == null) {
		submit.classList.remove("red-active");
	}
	else {
		if (!submit.classList.contains("red-active")){
			submit.classList.add("red-active");
			audLight.fastSeek(0);
			audLight.play();
		}
	}
}

bcode.onclick = function(){
	audScan.play();
	audScan.onended = function() {
		let hash = document.createElement("p");
		hash.textContent = fakeHash();
		hash.id = "hash";
		hash.className = "font-mono";
		loginForm.replaceChild(hash,bcode);
		audBeep.play();
		checkValidity();
	}
}

uname.oninput = function(){checkValidity()}

submit.onclick = function() {
	if (uname.value != "" && document.getElementById("hash") != null) {
		let username = uname.value;
		let biocode = document.getElementById("hash").textContent;
		let user = {username:username, biocode:biocode};
		createCookie("user", JSON.stringify(user));
		window.location.replace("/account/");
	}
	else {
		audDenied.play();
	}
}