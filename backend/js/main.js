/*
 * main.js
 */

import {Gen} from "./gen.js"
import {types} from "./tree.js"

let gen
let tree

let zoom = 1.0
let pan_x = 0
let pan_y = 0

//кнопки в navbar
const
btnPerson = document.getElementById("btnPerson"),
btnTree = document.getElementById("btnTree"),
btnEvent = document.getElementById("btnEvent"),
btnDocs = document.getElementById("btnDocs"),
btnMaps = document.getElementById("btnMaps"),
btnNotes = document.getElementById("btnNotes"),
btnSettings = document.getElementById("btnSettings"),
btnCreate = document.getElementById("btnCreate"),
btnLoad = document.getElementById("btnLoad"),
btnLoadInput = document.getElementById("btnLoadInput"),
btnSave = document.getElementById("btnSave"),
btnMode = document.getElementById("btnMode"),
btnExport = document.getElementById("btnExport");

const dropdown = document.getElementById("dropdown")

const canvasMain = document.getElementById("canvasMain")

// автоматическое закрытие панели настроек после нажатия кнопки
document.querySelectorAll(".dropdown-bar").forEach(n => n.addEventListener("click", ()=>{
	dropdown.classList.add("closed");
}))
btnSettings.addEventListener("mousemove", () => {
	dropdown.classList.remove("closed");
})

btnLoadInput.addEventListener("change", (e) => {
	read_file(e.target.files[0])
})

function read_file(file){
	let reader = new FileReader()
	reader.readAsArrayBuffer(file);

	reader.onload = function() {
		let view = new Uint8Array(reader.result)
		gen = new Gen(view)
		if (gen.err) {
			console.log(gen.err)
			gen = undefined
		}
	}

	reader.onerror = function() {
		console.log("Failed to read a file")
	}
}

btnTree.addEventListener("click", build_tree)

function build_tree(e) {
	if (gen == undefined)
		return

	tree = gen.tree_get(types.COMMON, 200, 100)
	zoom = tree.fit(canvasMain)
	tree.draw(canvasMain, zoom, pan_x, pan_y)
}

canvasMain.addEventListener("wheel", (e) => {
	if (e.deltaY < 0) {
		zoom += 0.1 * zoom
		pan_x = pan_x + (pan_x - e.x) * 0.1
		pan_y = pan_y + (pan_y - e.y) * 0.1

	} else {
		zoom -= 0.1 * zoom
		pan_x = pan_x - (pan_x - e.x) * 0.1
		pan_y = pan_y - (pan_y - e.y) * 0.1
	}

	if (tree != undefined)
		tree.draw(canvasMain, zoom, pan_x, pan_y)
});

canvasMain.addEventListener("mousemove", (e) => {
	if (e.buttons == 1) {
		pan_x += e.movementX
		pan_y += e.movementY
		if (tree != undefined)
			tree.draw(canvasMain, zoom, pan_x, pan_y)
	}
});
