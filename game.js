const questionText = document.getElementById("Question");
const timerText = document.getElementById("Timer");
const Selection = document.getElementById("Selection");
const Answer_A = document.getElementById("Answer_A");
const Answer_B = document.getElementById("Answer_B");
const Answer_C = document.getElementById("Answer_C");
const Answer_D = document.getElementById("Answer_D");
const AnswerButtons = [Answer_A,Answer_B,Answer_C,Answer_D];

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

let remainingQ = ruQ.slice();
let correct = Number;

function nextQuestion() {
	let question = remainingQ[RandomInt(0,remainingQ.length-1)];
	remainingQ.splice(remainingQ.indexOf(question),1);
	let rndFalse = shuffleA(question.False);
	let j = 0;
	correct = RandomInt(0,3);
	questionText.textContent = question.Question;
	for (let i in AnswerButtons){
		if (i == correct){
			AnswerButtons[i].textContent = question.Answer;
		}
		else {
			AnswerButtons[i].textContent = rndFalse[j];
			j++
		}
	}
}