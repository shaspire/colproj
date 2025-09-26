const emptyCart = document.getElementById("empty-cart");
const filledCart = document.getElementById("filled-cart");
const cartTable = document.getElementById("cart-tbody");
const Main = document.getElementById("main-container");
const totalCostHTML = document.getElementById("total-cost");
const totalItemsHTML = document.getElementById("total-items");

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

Object.defineProperties(Array.prototype, {
	count: {
		value: function(query) {
			/* 
			Counts number of occurrences of query in array, an integer >= 0 
			Uses the javascript == notion of equality.
			*/
			var count = 0;
			for(let i=0; i<this.length; i++){
				if (this[i] == query){
					count++;
				}
			}
			return count;
		}
	}
});

function generateRow(ItemID,amount) {
	let img  = "../img/uplink/"+Database[ItemID].Image;
	let name = Database[ItemID].Name;
	let cost = Database[ItemID].Cost;
	return `\
	<tr>
	<td>
	<div class="image-container">
	<img class="product-item__img" src="${img}" alt="${name}">
	</div>
	</td>
	<td>${name}</td>
	<td>${cost} TC</td>
	<td>${amount}x</td>
	`;
}

function updateTable() {
	var Cart = JSON.parse(getCookie("Cart"));
	totalItemsHTML.innerHTML += Cart.length;
	var totalCost = 0;
	for (let _i in Cart) {
		let ID = Cart[0];
		cartTable.insertAdjacentHTML("beforeend",generateRow(ID,Cart.count(ID)));
		totalCost += Database[ID].Cost * Cart.count(ID);
		var Cart = Cart.filter(i => i != ID);
		if (Cart[0] == undefined) {
			break;
		}
	}
	totalCostHTML.innerHTML += totalCost+" TC";
}


if (getCookie("Cart") != "") {
	updateTable();
	emptyCart.style.display = "none";
	filledCart.removeAttribute("style");
}