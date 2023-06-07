document.querySelectorAll(".list").forEach((item) => {
	item.ondragstart = function () {
		return false;
	};
});

document.querySelectorAll(".list-card").forEach((item) => {
	let placeholder = document.createElement("div");
	placeholder.classList.add("list-placeholder");
	item.ondragstart = function () {
		return false;
	};

	function createPlaceholder(element, mouseY) {
		let elementBounds = element.getBoundingClientRect();
		if (element.classList.contains("list-card")) {
			placeholder.getBoundingClientRect().top > elementBounds.top
				? element.insertAdjacentElement("beforebegin", placeholder)
				: element.insertAdjacentElement("afterend", placeholder);
		} else if (element.classList.contains("list")) {
			element = element.closest(".list-wrapper").querySelector(".list-cards");
			let elementBounds = element.getBoundingClientRect();
			if (element.hasChildNodes()) {
				if (mouseY > elementBounds.top + elementBounds.height) {
					element.appendChild(placeholder);
				} else if (mouseY < elementBounds.top) {
					element.insertBefore(placeholder, element.firstChild);
				}
			} else {
				element.appendChild(placeholder);
			}
		}
	}

	item.onmousedown = function (e) {
		item.classList.add("list-card-dragging");
		moveTo(e.pageX, e.pageY);

		function moveTo(x, y) {
			item.style.left = x - item.getBoundingClientRect().width / 2 + "px";
			item.style.top = y - item.getBoundingClientRect().height / 2 + "px";
		}

		function onDrag(e) {
			moveTo(e.pageX, e.pageY);
			let elementBelow = document.elementFromPoint(e.clientX, e.clientY);
			if (
				elementBelow &&
				!elementBelow.classList.contains("list-placeholder")
			) {
				createPlaceholder(elementBelow, e.clientY);
			}
		}

		function onLetGo() {
			placeholder.insertAdjacentElement("beforebegin", item);
			placeholder.remove();
			item.classList.remove("list-card-dragging");
			document.removeEventListener("mousemove", onDrag);
			document.removeEventListener("mouseup", onLetGo);
		}

		document.addEventListener("mousemove", onDrag);
		document.addEventListener("mouseup", onLetGo);
		createPlaceholder(item);
	};
});

document.querySelector(".add-list").onclick = function (e) {
	let list = document.createElement("div");
	list.classList.add("list", "list-wrapper");
	let listContent = document.createElement("div");
	listContent.classList.add("list", "list-content");
	let listHeader = document.createElement("div");
	listHeader.classList.add("list", "list-header");
	listHeader.textContent = "LIST";
	listContent.appendChild(listHeader);
	let listCards = document.createElement("div");
	listCards.classList.add("list", "list-cards");
	listContent.appendChild(listCards);
	let listCompose = document.createElement("div");
	listCompose.classList.add("list", "list-compose");
	listCompose.textContent = "Add new item";
	listContent.appendChild(listCompose);
	list.appendChild(listContent);
	let board = document.querySelector(".board");
	board.lastElementChild.insertAdjacentElement("beforebegin", list);
	console.log(list);
};