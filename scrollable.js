import { scrollFunction } from "./functions.js";

document.querySelectorAll(".list").forEach((item) => {
	if (!item.closest(".list-card")) {
		item.onmousedown = scrollFunction;
	}
});

document.querySelector(".add-list-wrapper").onmousedown = scrollFunction;

document.querySelectorAll(".list").forEach((item) => {
	item.ondragstart = function () {
		return false;
	};
});
