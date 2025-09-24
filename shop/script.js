function generateCard(type,image,name,description,price) {
	return `\
	<article class="product-item">\n\
	<div class="image-button-container">\n\
	<div class="image-container">\n\
	<img src="${image}" alt="${name}">\n\
	</div>\n\
	<button class="product-item__button">${price} TC</button>\n\
	</div>\n\
	<div class="name-description-container">\n\
	<div class="name-type-container">\n\
	<h2 class="product-item__name">${name}</h2>\n\
	<p class="product-item__type">${type}</p>\n\
	</div>\n\
	<p class="product-item__description">${description}</p>\n\
	</div>\n\
	</article>`;
}

function updateSearchResults() {
	searchResults.replaceChildren();
	let userInput = searchInput.value.toLowerCase();
	for (let i in Database) {
		if ( (userFilters.length == 0 || userFilters.includes(Database[i].Type)) && Database[i].Name.toLowerCase().includes(userInput) ) {
			let t = Database[i].Type;
			let x = "./img/uplink/"+Database[i].Image;
			let y = Database[i].Name;
			let z = Database[i].Description;
			let w = Database[i].Cost;
			searchResults.insertAdjacentHTML("beforeend",generateCard(t,x,y,z,w));
		}
	}
	searchResults.querySelectorAll(".product-item__button").forEach(btn => {
		btn.onclick = () => {
			audio.fastSeek(0);
			audio.play();
		}
	});
}

var userFilters = new Array;
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

document.getElementById("audio").volume = 0.2;
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
searchResults.style.height = window.innerHeight - searchResults.getBoundingClientRect().top+"px";

searchInput.oninput = function() {updateSearchResults()};
updateSearchResults();
