import { itemForm } from "./functions.js";

document.querySelectorAll(".open-compose").forEach((item) => {
	item.onclick = itemForm;
});
