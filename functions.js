export function scrollFunction(e) {
	let item = e.target.closest(".board");
	let viewport = item.closest(".board").querySelector(".viewport");
	let pos = {
		// The current scroll
		left: item.scrollLeft,
		top: item.scrollTop,
		// Get the current mouse position
		x: e.clientX,
	};
	const mouseMoveHandler = function (e) {
		// How far the mouse has been moved
		if (!item.querySelector(".list-placeholder")) {
			const dx = e.clientX - pos.x;
			// Scroll the element
			item.scrollLeft = pos.left - dx;
			viewport.scrollLeft = pos.left - dx;
		}
	};
	const mouseUpHandler = function () {
		document.removeEventListener("mousemove", mouseMoveHandler);
		document.removeEventListener("mouseup", mouseUpHandler);
		item.style.removeProperty("user-select");
	};
	document.addEventListener("mousemove", mouseMoveHandler);
	document.addEventListener("mouseup", mouseUpHandler);
}

export function makeMovable(item) {
	let board = item.closest(".board");
	let viewport = board.querySelector(".viewport").getBoundingClientRect();
	let placeholder = document.createElement("div");
	placeholder.style.hieght = item.style.height;
	let mouseHeld = false;
	placeholder.classList.add("list-placeholder");
	item.ondragstart = function () {
		return false;
	};

	function scrollToFit(mouseX) {
		if (mouseX < viewport.left + 200) {
			board.scrollLeft -= 5;
			viewport.scrollLeft -= 5;
		} else if (mouseX > viewport.right - 200) {
			board.scrollLeft += 5;
			viewport.scrollLeft += 5;
		}
	}

	function createPlaceholder(element, mouseY) {
		let elementBounds = element.getBoundingClientRect();
		if (element.closest(".list-card")) {
			element = element.closest(".list-card");
			console.log(element);
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
		let event = e;
		moveTo(event.pageX, event.pageY);
		item.classList.add("list-card-dragging");

		function moveTo(x, y) {
			item.style.left = x - item.getBoundingClientRect().width / 2 + "px";
			item.style.top = y - item.getBoundingClientRect().height / 2 + "px";
		}

		function onDrag() {
			if (mouseHeld) {
				moveTo(event.pageX, event.pageY);
				let elementBelow = document.elementFromPoint(
					event.clientX,
					event.clientY
				);
				scrollToFit(event.clientX);
				if (
					elementBelow &&
					!elementBelow.classList.contains("list-placeholder")
				) {
					createPlaceholder(elementBelow, event.clientY);
				}
				setTimeout(onDrag, 1);
			}
		}

		function onMove(e) {
			event = e;
		}

		function onLetGo() {
			placeholder.insertAdjacentElement("afterend", item);
			placeholder.remove();
			item.classList.remove("list-card-dragging");
			mouseHeld = false;
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseup", onLetGo);
		}

		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseup", onLetGo);
		mouseHeld = true;
		onDrag();
		createPlaceholder(item);
	};
}

export function itemForm(e) {
	let element = e.target.closest(".open-compose");
	element.style.display = "none";
	let form = e.target.closest(".list-compose").querySelector(".compose-form");
	form.style.display = "block";
	form.querySelector("input").focus();
	form.addEventListener("submit", submitItemForm);
}

function submitItemForm(e) {
	e.preventDefault();
	let itemName = e.target.firstElementChild.value;
	let card = document.createElement("div");
	card.classList.add("list", "list-card");
	card.innerHTML = `<div class="list card-content">${itemName}</div>`;
	let list = e.target.closest(".list-content").querySelector(".list-cards");
	list.appendChild(card);
	makeMovable(card);
	let formButton = e.target
		.closest(".list-compose")
		.querySelector(".open-compose");
	formButton.style.display = "block";
	e.target.style.display = "none";
	e.target.reset();
	e.target.removeEventListener("submit", submitItemForm);
}

export function listForm(e) {
	e.target.closest(".open-add-list").style.display = "none";
	let form = document.querySelector(".add-list-form");
	form.style.display = "block";
	form.querySelector("input").focus();
	form.addEventListener("submit", submitListForm);
}

function submitListForm(e) {
	e.preventDefault();
	let listName = e.target.firstElementChild.value;
	let list = document.createElement("div");
	list.classList.add("list", "list-wrapper");
	list.onmousedown = scrollFunction;
	list.innerHTML = `<div class="list list-content">
                      <div class="list list-header">${listName}</div>
                      <div class="list list-cards"></div>
                      <div class="list list-compose">
                        <a href="#" class="list open-compose">
                          <span>Add new item</span>
                        </a>
                        <form class="list compose-form">
                          <input type="text" name="list-name" id="list-name" />
                        </form>
                      </div>
                  </div>`;
	list.querySelector(".open-compose").onclick = itemForm;
	let board = document.querySelector(".board");
	board.lastElementChild.previousElementSibling.insertAdjacentElement(
		"beforebegin",
		list
	);
	e.target
		.closest(".add-list-content")
		.querySelector(".open-add-list").style.display = "block";
	e.target.style.display = "none";
	e.target.reset();
}
