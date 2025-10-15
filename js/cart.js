const audLaunch = new Audio("./hyperspace_begin.ogg")
const emptyCart = document.getElementById("empty-cart");
const filledCart = document.getElementById("filled-cart");
const cartTable = document.getElementById("cart-tbody");
const totalCost = document.getElementById("total-cost");
const totalItems = document.getElementById("total-items");
const sideButtons = document.getElementById("buttons");
const resetBtn = document.getElementById("reset-btn");
const proceedBtn = document.getElementById("proceed-btn");

function generateRow(ItemID,amount) {
	let img  = "../img/uplink/"+Database[ItemID].Image;
	let name = Database[ItemID].Name;
	let cost = Database[ItemID].Cost;
	return `\
	<tr>
	<td class="img-column">
	<div class="image-container">
	<img class="product-item__img" src="${img}" alt="${name}">
	</div>
	</td>
	<td class="name-column">${name}</td>
	<td class="cost-column">${cost} TC</td>
	<td class="amount-column">
	<div class="amount-container">
	<button class="btn dec" data-id="${ItemID}">-</button>
	<p>${amount}x</p>
	<button class="btn inc" data-id="${ItemID}"="btn inc">+</button>
	</td>
	</tr>`;
}

function updateOverview() {
	let Cost = 0;
	let Cart = JSON.parse(getCookie("Cart"));
	totalItems.textContent = "Amount of Items: "+Cart.length;
	while (Cart[0] != undefined) {
		let ID = Cart[0];
		Cost += Database[ID].Cost * Cart.count(ID);
		Cart = Cart.filter(i => i != ID);
	}
	totalCost.textContent = "Total Cost: "+Cost+" TC";
}

function updateTable() {
	let Cart = JSON.parse(getCookie("Cart"));
	Cart.sort((a,b) => a - b);
	cartTable.replaceChildren(cartTable.children[0]);
	while (Cart[0] != undefined) {
		let ID = Cart[0];
		cartTable.insertAdjacentHTML("beforeend",generateRow(ID,Cart.count(ID)));
		Cart = Cart.filter(i => i != ID);
	}
	updateOverview();
	cartTable.querySelectorAll(".inc").forEach(btn => {
		btn.onclick = () => {
			addToCart(btn.getAttribute("data-id"));
			checkCart();;
		}
	});
	cartTable.querySelectorAll(".dec").forEach(btn => {
		btn.onclick = () => {
			decFromCart(btn.getAttribute("data-id"));
			checkCart();;
		}
	});
}

proceedBtn.onclick = () => {
	if (proceedBtn.classList.contains("red-active")) {
		audLaunch.play();
		let countDown = document.createElement("p");
		countDown.textContent = "Teleporting everything to your position in 5";
		sideButtons.replaceChildren(countDown);
		let i = 4;
		timer = setInterval(() => {
			countDown.textContent = "Teleporting everything to your position in "+i;
			i--
			if (i < 0){
				createCookie("Cart", undefined, -1);
				countDown.textContent = "Give 'em hell!";
			}
		}, 1000);
	}
	proceedBtn.classList.add("red-active");
	proceedBtn.textContent = "Are you sure?";
}

audLaunch.onended = () => {
	location.reload();
}

resetBtn.onclick = () => {
	if (resetBtn.classList.contains("red-active")) {
		createCookie("Cart", undefined, -1);
		location.reload();
	}
	resetBtn.classList.add("red-active");
	resetBtn.textContent = "Are you sure?";
}

[proceedBtn,resetBtn].forEach(btn => {	
	let originText = btn.textContent;
	btn.onblur = () => {
		btn.classList.remove("red-active");
		btn.textContent = originText;
	}
})

function checkCart() {
	if (getCookie("Cart") !== "") {
		updateTable();
		emptyCart.style.display = "none";
		filledCart.removeAttribute("style");
	}
	else {
		filledCart.style.display = "none";
		emptyCart.removeAttribute("style");
	}
}

checkCart();