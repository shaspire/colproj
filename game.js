const start_btn = document.getElementById("start-btn");
const questionText = document.getElementById("question");
const timerText = document.getElementById("timer");
const ans_A_btn = document.getElementById("0-0_btn");
const ans_B_btn = document.getElementById("0-1_btn");
const ans_C_btn = document.getElementById("1-0_btn");
const ans_D_btn = document.getElementById("1-1_btn");

const ans_A_text = document.getElementById("0-0_text");
const ans_B_text = document.getElementById("0-1_text");
const ans_C_text = document.getElementById("1-0_text");
const ans_D_text = document.getElementById("1-1_text");

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

let remainingQ = ruQ.slice();
let correct = Number;

function nextQuestion() {
	const btns = [ans_A_text,ans_B_text,ans_C_text,ans_D_text];
	let question = remainingQ[RandomInt(0,remainingQ.length-1)];
	remainingQ.splice(remainingQ.indexOf(question),1);
	let rndFalse = shuffleA(question.False);
	let j = 0;
	correct = RandomInt(0,3);
	questionText.textContent = question.Question;
	for (let i in btns){
		if (i == correct){
			btns[i].textContent = question.Answer;
		}
		else {
			btns[i].textContent = rndFalse[j];
			j++
		}
	}
}
{
	let C = 0;
	let R = 0;
	const MenuCursor = new Audio("/sfx/MenuCursor.ogg");
	const MenuSelect = new Audio("/sfx/MenuSelect.ogg")
	const btns = [[ans_A_btn,ans_B_btn],[ans_C_btn,ans_D_btn]];
	window.onkeydown = (event) => {
		if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(event.key)){
			//TODO: Implement UI via OOP
			MenuCursor.play();
			btns[R][C].classList.remove("answer-selected");
			event.key === "ArrowUp" ? R = Math.abs(R-1) % 2 : false;
			event.key === "ArrowDown" ? R = Math.abs(R+1) % 2 : false;
			event.key === "ArrowLeft" ? C = Math.abs(C-1) % 2 : false;
			event.key === "ArrowRight" ? C = Math.abs(C+1) % 2 : false;
			btns[R][C].classList.add("answer-selected");
			Selected = parseInt(R+""+C+"",2);
		}

		if (["Z","z","Enter"].includes(event.key)){
			MenuSelect.play();
		}
	}
}
