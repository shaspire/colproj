var userFilters = new Array;
const searchFilters = document.getElementById("search-filters");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const collapseFilters = document.getElementById("collapse-filters");
const audCash = new Audio("./cash-register.mp3");
audCash.volume = 0.2;

function generateCard(ItemID) {
	let type = Database[ItemID].Type;
	let img  = "./img/uplink/"+Database[ItemID].Image;
	let name = Database[ItemID].Name;
	let desc = Database[ItemID].Description;
	let cost = Database[ItemID].Cost;
	return `\
	<article class="product-item">
	<div class="image-button-container">
	<div class="image-container">
	<img class="product-item__img" src="${img}" alt="${name}">
	</div>
	<button class="product-item__button font-24" data-id="${ItemID}">${cost} TC</button>
	</div>
	<div class="name-description-container">
	<div class="name-type-container">
	<h2 class="product-item__name">${name}</h2>
	<p class="product-item__type">${type}</p>
	</div>
	<p class="product-item__description font-22">${desc}</p>
	</div>
	</article>`;
}

function updateSearchResults() {
	searchResults.replaceChildren();
	for (let i in Database) { searchResults.insertAdjacentHTML("beforeend",generateCard(i)); }
	searchResults.querySelectorAll(".product-item__button").forEach(btn => {
		btn.onclick = () => {
			addToCart(btn.getAttribute("data-id"));
			audCash.fastSeek(0);
			audCash.play();
		}
	});
}

function filterCurrentResults() {
	let userInput = searchInput.value.toLowerCase();
	searchResults.querySelectorAll(".product-item").forEach(element => {
		let itemType = element.querySelector(".product-item__type").textContent;
		let itemName = element.querySelector(".product-item__name").textContent;
		if ( (userFilters.length == 0 || userFilters.includes(itemType)) && itemName.toLowerCase().includes(userInput) ) {
			element.removeAttribute("style");
		}
		else { element.style.display = "none"; }
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
		filterCurrentResults();
	}
});

collapseFilters.onclick = () => {
	if (collapseFilters.classList.contains("active")) {
		searchFilters.removeAttribute("style");
		collapseFilters.classList.remove("active");
	}
	else {
		searchFilters.style.display = "flex";
		collapseFilters.classList.add("active");
	}
}

searchInput.oninput = () => {filterCurrentResults()};
updateSearchResults();
