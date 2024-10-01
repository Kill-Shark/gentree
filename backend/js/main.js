


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
btnSave = document.getElementById("btnSave"),
btnMode = document.getElementById("btnMode"),
btnExport = document.getElementById("btnExport");

const dropdown = document.getElementById("dropdown")

const canvasMain = document.getElementById("canvasMain")

//кнопка для работы с импортируемым файлом
const btnLoadInput = document.getElementById("btnLoadInput")

// автоматическое закрытие панели настроек после нажатия кнопки
document.querySelectorAll(".dropdown-bar").forEach(n => n.addEventListener("click", ()=>{
	dropdown.classList.add("closed");
}))
btnSettings.addEventListener("mousemove", ()=>{
	dropdown.classList.remove("closed");
})



// когда будешь прикручивать функционал к кнопкам, 
// не используй стрелочные функции - создавай именные!
// это важно для интерфейса, который еще нужно докручивать

// внизу пример, который можешь переименовать

btnLoad.addEventListener("click", Loading);

function Loading(){
	console.log("Загружено")
}