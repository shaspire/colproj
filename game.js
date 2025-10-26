{//Make everything innaccessible from console
//HTML elements
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
//Audio
//These functions may seem unnecessary, but I had to use them because Audio.currentTime doesn't work properly in Firefox
function cursor_sound() {
	let sound = new Audio("./sfx/MenuCursor.ogg");
	sound.play();
}
function select_sound() {
	let sound = new Audio("./sfx/MenuSelect.ogg");
	sound.play();
}
const correct_sound = new Audio ("./sfx/sound_audio_snd_dumbvictory.wav");
const wrong_sound = new Audio ("./sfx/snd_hurt1_c.wav");
const music = new Audio("./sfx/MetalCrusher.mp3");
music.loop = true;
music.volume = 0.3;

//Functions
function RandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffleA(a) {
	let o = a.slice();
	for (let i = o.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[o[i], o[j]] = [o[j], o[i]];
	}
	return o;
}

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
		correct_sound.play();
	}
	else {
		if (typeof(selected) != "number") {
			timer_text.classList.add("wrong");
		}
		else {
			ans_text_list[selected].classList.add("wrong");
			ans_btns_list[selected].classList.add("wrong");
		}
		wrong_sound.play();
	}
}

let timer = null;
function questionTimer(seconds,func = {}) {
	clearInterval(timer);
	timer_text.textContent = seconds;
	timer = setInterval(() => {
		seconds--;
		timer_text.textContent = seconds;
		if (seconds<=0) {
			timer_text.textContent = "X";
			func();
			clearInterval(timer);
		}
	}, 1000);
}

let correct = null;
async function spawnQuestion(question) {
	answer_grid.style.display = "none";
	question_text.textContent = question.Question;
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

let selected = null;
async function waitForAnswer(seconds) {
	seconds = typeof(seconds) == "number" ? seconds : 15;
	await new Promise((resolve) => {
		let C = 0;
		let R = 0;	
		ans_btns_binary[R][C].classList.add("answer-selected");
		questionTimer(seconds,resolve);
		window.onkeydown = (event) => {
			if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(event.code) && event.repeat == false){
				ans_btns_binary[R][C].classList.remove("answer-selected");
				event.code === "ArrowUp" ? R = Math.abs(R-1) % 2 : false;
				event.code === "ArrowDown" ? R = Math.abs(R+1) % 2 : false;
				event.code === "ArrowLeft" ? C = Math.abs(C-1) % 2 : false;
				event.code === "ArrowRight" ? C = Math.abs(C+1) % 2 : false;
				ans_btns_binary[R][C].classList.add("answer-selected");
				cursor_sound();
			}
			
			if (["KeyZ","Enter"].includes(event.code) && event.repeat == false){
				if (selected == parseInt(`${R}${C}`,2)) {
					clearInterval(timer);
					window.onkeydown = undefined;
					resolve();
				}
				else {
					typeof(selected) == "number" ? ans_text_list[selected].classList.remove("answer-selected") : false;
					selected = parseInt(`${R}${C}`,2);
					ans_text_list[selected].classList.add("answer-selected");
					select_sound();
				}
			}
		}
	});
}

//Main
async function startGame() {
	document.getElementById("game").removeAttribute("style");
	document.getElementById("menu").style.display = "none";
	let remainingQ = ruQ.slice();
	music.play(); 
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
		select_sound();
	}

	answer_grid.style.display = "none";
	question_text.style.display = "none";
	timer_text.textContent = "Закончились вопросы";
}

//Press Start
window.onkeydown = (event) => {
		if (["KeyZ","Enter"].includes(event.code)){
			select_sound();
			window.onkeydown = undefined;
			startGame();
		}
	}

}