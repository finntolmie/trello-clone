import { makeMovable } from "./functions.js";

document.querySelectorAll(".list-card").forEach((item) => {
	makeMovable(item);
});
