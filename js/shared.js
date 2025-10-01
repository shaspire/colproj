function createCookie(name, value, days) {
	let expires;
	if (days) {
		let date = new Date();
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

Object.defineProperties(Array.prototype, {
	count: {
		value: function(query) {
			/* 
			Counts number of occurrences of query in array, an integer >= 0 
			Uses the javascript == notion of equality.
			*/
			let count = 0;
			for(let i=0; i<this.length; i++){
				if (this[i] == query){
					count++;
				}
			}
			return count;
		}
	}
});

function addToCart(ItemID) {
	(getCookie("Cart") == "") ? (Cart = new Array) : (Cart = JSON.parse(getCookie("Cart")));
	Cart.push(ItemID);
	createCookie("Cart", JSON.stringify(Cart));
}

function decFromCart(ItemID) {
	(getCookie("Cart") == "") ? true : (Cart = JSON.parse(getCookie("Cart")));
	Cart.indexOf(ItemID) == -1 ? true : Cart.splice(Cart.indexOf(ItemID),1);
	createCookie("Cart", JSON.stringify(Cart));
}

if (getCookie("user") != "" && document.getElementById("user-link") != null) {
	let user = JSON.parse(getCookie("user"));
	let userlink = document.getElementById("user-link");
	userlink.setAttribute("href","/account/");
	userlink.textContent = user.username;
}