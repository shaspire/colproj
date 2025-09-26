document.getElementById("audio").volume = 0.2;
var userFilters = new Array;
const searchFilters = document.getElementById("search-filters");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const collapseFilters = document.getElementById("collapse-filters");
searchResults.style.height = window.innerHeight - searchResults.getBoundingClientRect().top+"px";

function createCookie(name, value, days) {
	var expires;
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	}
	else {
		expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

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

function generateCard(ItemID) {
	let type = Database[ItemID].Type;
	let img  = "./img/uplink/"+Database[ItemID].Image;
	let name = Database[ItemID].Name;
	let desc = Database[ItemID].Description;
	let cost = Database[ItemID].Cost;
	return `\
	<article class="product-item">\n\
	<div class="image-button-container">\n\
	<div class="image-container">\n\
	<img class="product-item__img" src="${img}" alt="${name}">\n\
	</div>\n\
	<button class="product-item__button" data-id="${ItemID}">${cost} TC</button>\n\
	</div>\n\
	<div class="name-description-container">\n\
	<div class="name-type-container">\n\
	<h2 class="product-item__name">${name}</h2>\n\
	<p class="product-item__type">${type}</p>\n\
	</div>\n\
	<p class="product-item__description">${desc}</p>\n\
	</div>\n\
	</article>`;
}

function addToCart(ItemID) {
	if (getCookie("Cart") == "") {
		var Cart = new Array;
		Cart.push(ItemID);
		createCookie("Cart", JSON.stringify(Cart));
	}
	else {
		Cart = JSON.parse(getCookie("Cart"));
		Cart.push(ItemID);
		createCookie("Cart", JSON.stringify(Cart));
	}
}

function updateSearchResults() {
	searchResults.replaceChildren();
	let userInput = searchInput.value.toLowerCase();
	for (let i in Database) {
		if ( (userFilters.length == 0 || userFilters.includes(Database[i].Type)) && Database[i].Name.toLowerCase().includes(userInput) ) {
			searchResults.insertAdjacentHTML("beforeend",generateCard(i));
		}
	}
	searchResults.querySelectorAll(".product-item__button").forEach(btn => {
		btn.onclick = () => {
			addToCart(btn.getAttribute("data-id"));
			audio.fastSeek(0);
			audio.play();
		}
	});
}

document.querySelectorAll(".filter-option").forEach(btn => {
	btn.onclick = () => {
		if (userFilters.includes(btn.value)) {
			userFilters = userFilters.filter(i => i !== btn.value);
			btn.classList.remove("active");
		}
		else {
			userFilters.push(btn.value);
			btn.classList.add("active");
		}
		updateSearchResults();
	}
});

collapseFilters.onclick = function() {
	if (collapseFilters.classList.contains("active")) {
		searchFilters.removeAttribute("style");
		collapseFilters.classList.remove("active");
	}
	else {
		searchFilters.style.display = "flex";
		searchFilters.parentNode.style.top = collapseFilters.getBoundingClientRect().bottom+"px";
		collapseFilters.classList.add("active");
	}
}

searchInput.oninput = function() {updateSearchResults()};
updateSearchResults();
