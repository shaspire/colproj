{//Make everything innaccessible from console
const question_text = document.getElementById("question");
const timer_text = document.getElementById("timer");
const answer_grid = document.getElementById("answer-grid");
const ansA_btn = document.getElementById("0-0_btn");
const ansB_btn = document.getElementById("0-1_btn");
const ansC_btn = document.getElementById("1-0_btn");
const ansD_btn = document.getElementById("1-1_btn");
const ans_btns_list = [ansA_btn,ansB_btn,ansC_btn,ansD_btn];
const ans_btns_binary = [[ansA_btn,ansB_btn],[ansC_btn,ansD_btn]];

const ansA_text = document.getElementById("0-0_text");
const ansB_text = document.getElementById("0-1_text");
const ansC_text = document.getElementById("1-0_text");
const ansD_text = document.getElementById("1-1_text");
const ans_text_list = [ansA_text,ansB_text,ansC_text,ansD_text];

//await sleep();
async function sleep(ms) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

function RandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

//Shuffle Array
function shuffleA(a) {
	let o = a.slice();
	for (let i = o.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[o[i], o[j]] = [o[j], o[i]];
	}
	return o;
}

//await waitForInput();
async function waitForInput() {
	await new Promise((resolve) =>
		window.onkeydown = (event) => {		
			if (["KeyZ","Enter"].includes(event.code) && event.repeat == false){
				window.onkeydown = undefined;
				resolve();
		}
		});
}

function checkAnswer() {
	timer_text.textContent = "X";
	if (selected == correct) {
		ans_text_list[selected].classList.add("correct");
		ans_btns_list[selected].classList.add("correct");
		new Audio ("./sfx/sound_audio_snd_dumbvictory.wav").play();
	}
	else {
		if (typeof(selected) != "number") {
			timer_text.classList.add("wrong");
		}
		else {
			ans_text_list[selected].classList.add("wrong");
			ans_btns_list[selected].classList.add("wrong");
		}
		new Audio ("./sfx/snd_hurt1_c.wav").play();
	}
}

//Basically, it can work as SetTimeout, but can be used just to set a countdown
let timer = null;
function questionTimer(seconds,func = undefined) {
	clearInterval(timer);
	let i = 0;
	timer_text.textContent = seconds;
	timer = setInterval(() => {
		i++;
		timer_text.textContent = seconds - i;
		if (i>=seconds) {
			timer_text.textContent = "X";
			func != undefined ? func() : false;
			clearInterval(timer);
		}
	}, 1000);
}

let remainingQ = ruQ.slice();
let selected = null;
let correct = null;
async function spawnQuestion(question) {
	answer_grid.style.display = "none";
	question_text.textContent = question.Question;
	//Place answers randomly
	correct = RandomInt(0,3);
	let rndWrong = shuffleA(question.Wrong);
	let j = 0;
	await new Promise((resolve) =>
		questionTimer(3, () => {
			for (let i in ans_text_list) {
				if (i == correct){
					ans_text_list[i].textContent = question.Answer;
				}
				else {
					ans_text_list[i].textContent = rndWrong[j];
					j++
				}
			}
			answer_grid.removeAttribute("style");
			resolve();
		})
	);
}

async function waitForAnswer(time) {
	time = typeof(time) == "number" ? time : 15;
	let C = 0;
	let R = 0;
	await new Promise((resolve) => {
		questionTimer(time,resolve);
		window.onkeydown = (event) => {
			if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(event.code) && event.repeat == false){
				ans_btns_binary[R][C].classList.remove("answer-selected");
				event.code === "ArrowUp" ? R = Math.abs(R-1) % 2 : false;
				event.code === "ArrowDown" ? R = Math.abs(R+1) % 2 : false;
				event.code === "ArrowLeft" ? C = Math.abs(C-1) % 2 : false;
				event.code === "ArrowRight" ? C = Math.abs(C+1) % 2 : false;
				ans_btns_binary[R][C].classList.add("answer-selected");
				new Audio("./sfx/MenuCursor.ogg").play();
			}
			
			if (["KeyZ","Enter"].includes(event.code) && event.repeat == false){
				if (selected == parseInt(R+""+C+"",2)) {
					clearInterval(timer);
					window.onkeydown = undefined;
					resolve();
				}
				else {
					typeof(selected) == "number" ? ans_text_list[selected].classList.remove("answer-selected") : false;
					selected = parseInt(R+""+C+"",2);
					ans_text_list[selected].classList.add("answer-selected");
					new Audio("./sfx/snd_bell.wav").play();
				}
			}
		}}
	);
}

const Music = new Audio("./sfx/MetalCrusher.mp3");
Music.loop = true;
Music.volume = 0.2;

async function startGame() {
	//Preloading audio
	new Audio("./sfx/MenuCursor.ogg").preload = "auto";
	new Audio("./sfx/snd_bell.wav").preload = "auto";
	new Audio ("./sfx/snd_hurt1_c.wav").preload = "auto";
	new Audio ("./sfx/sound_audio_snd_dumbvictory.wav").preload = "auto";
	//Preparations
	document.getElementById("game").removeAttribute("style");
	document.getElementById("menu").style.display = "none";
	Music.play(); 
	//Starting
	questionTimer(3);
	await sleep(3);
	//Game loop until questions are run out
	while(remainingQ.length != 0) {
		//0
		let question = remainingQ[RandomInt(0,remainingQ.length-1)];
		remainingQ.splice(remainingQ.indexOf(question),1);
		await spawnQuestion(question);
		//1
		await waitForAnswer(question.Time);
		//2
		checkAnswer();
		await waitForInput();
		selected = null;
		document.querySelectorAll(".correct,.wrong,.answer-selected").forEach(element => {
			element.classList.remove("correct");
			element.classList.remove("wrong");
			element.classList.remove("answer-selected");
		});
		new Audio("./sfx/MenuSelect.ogg").play();
	//repeat
	}
	answer_grid.style.display = "none";
	question_text.style.display = "none";
	timer_text.textContent = "Закончились вопросы";
}

//Press Start
window.onkeydown = (event) => {
		if (["KeyZ","Enter"].includes(event.code)){
			new Audio("./sfx/MenuSelect.ogg").play();
			startGame();
			window.onkeydown = undefined;
		}
	}
}