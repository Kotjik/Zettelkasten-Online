/* eslint-env browser */

import Note from "./note.js";
import Data from "./data.js";
import MinimizedNote from "./minimizedNote.js";
import FullNote from "./fullNote.js";

function init() {
	console.log(data.dataArray);
	sortSelect.value = "last-updated-desc";
	filterSelect.value = "nothing";
	searchInput.value = "";
	loadAllNotesToDOM();

}

// declarations
let data = new Data(),
		currentNoteId = 0,
		buttonNewNote = document.getElementById("button-new-note"),
		buttonNewNoteCancel = document.getElementById("button-new-note-cancel"),
		buttonNewNoteSave = document.getElementById("button-new-note-save"),
		buttonNewNoteDelete = document.getElementById("button-new-note-delete"),
		buttonDeleteConfirm = document.getElementById("button-delete-confirm"),
		buttonDeleteCancel = document.getElementById("button-delete-cancel"),
		confirmationDeletionWindow = document.getElementById("confirmation-deletion"),
		noteFullWindow = document.getElementById("note-full-window"),
		noteFull = document.querySelector(".note-full"),
		newNoteEditor = document.getElementById("note-editor"),
		colorBoxes = document.getElementsByClassName("color-box"),
		noteList = document.getElementById("note-list"),
		notesMinimized = document.getElementsByClassName("note-minimized"),
		closeButton = document.querySelector(".close-button"),
		editButton = document.querySelector(".edit-button"),
		searchInput = document.querySelector("#searchInput"),
		sortSelect = document.querySelector("#sort-select"),
		filterSelect = document.querySelector("#filter-select"),
		toolbarOptions = [
		["bold", "italic", "underline", "strike"],				// toggled buttons
		["blockquote", "code-block"],

		[{ "header": 1 }, { "header": 2 }],								// custom button values
		[{ "list": "ordered"}, { "list": "bullet" }],
		[{ "script": "sub"}, { "script": "super" }],			// superscript/subscript
		[{ "indent": "-1"}, { "indent": "+1" }],					// outdent/indent
		[{ "direction": "rtl" }],													// text direction

		[{ "size": ["small", false, "large", "huge"] }],	// custom dropdown
		[{ "header": [1, 2, 3, 4, 5, 6, false] }],

		[{ "color": [] }, { "background": [] }],					// dropdown with defaults from theme
		[{ "font": [] }],
		[{ "align": [] }],

		["clean"], 																				// remove formatting button
		],
		quill = new Quill("#description-input", {
			modules: {
				toolbar: toolbarOptions,
			},
			placeholder: "Beschreibung",
			theme:"snow",
		});

for(let i=0; i<colorBoxes.length; i++){
	colorBoxes[i].addEventListener("click", function(){
		document.querySelector(".highlighted").classList.remove("highlighted");
		colorBoxes[i].classList.add("highlighted");
	});
}

buttonNewNote.addEventListener("click", function(){
	currentNoteId = 0;
	document.querySelector("#title-input").innerHTML = "";
	document.getElementById("source-input").innerHTML = "";
	document.getElementById("theme-input").innerHTML = "";
	document.querySelector(".ql-editor").innerHTML = "";
	document.querySelector(".note-editor-heading").innerHTML = "Neuen Zettel anlegen";
	buttonNewNoteDelete.classList.add("hidden");
	openNoteEditor();
});
buttonNewNoteCancel.addEventListener("click", closeNewNoteEditor);
buttonNewNoteSave.addEventListener("click", saveNote);
buttonNewNoteDelete.addEventListener("click", function(){
	confirmDeletion();
});
buttonDeleteConfirm.addEventListener("click", function(){
	deleteNote(currentNoteId);
});
buttonDeleteCancel.addEventListener("click", function(){
	confirmationDeletionWindow.classList.add("hidden");
});
searchInput.addEventListener("keyup", searchNotes);
sortSelect.addEventListener("change", sortNotes);
filterSelect.addEventListener("change", function(){
	filterNotes(filterSelect.value);
	filterSelect.className = filterSelect.value;
});

// functions

function closeFullNote(){
	noteFull.classList.add("hidden");
}

function openNoteEditor(){

	noteFull.classList.add("hidden");
	newNoteEditor.classList.remove("hidden");
}

function closeNewNoteEditor(){
	confirmationDeletionWindow.classList.add("hidden");
	newNoteEditor.classList.add("hidden");

	document.getElementById("title-input").value = "";
	document.getElementById("description-input").value = "";
	// document.getElementById("description-input").innerHTML = "";
	document.getElementById("source-input").value = "";
	document.getElementById("theme-input").value = "";
	for(let i = 0; i < colorBoxes.length; i++){
		colorBoxes[i].classList.remove("highlighted");
	}
	colorBoxes[0].classList.add("highlighted");
}

function saveNote(){
	let titleInput = document.getElementById("title-input").value,
			// descriptionInput = document.getElementById("description-input").value,
			descriptionInput = document.querySelector(".ql-editor").innerHTML,
			sourceInput = document.getElementById("source-input").value,
			themeInput = document.getElementById("theme-input").value,
			colorInput = document.querySelector(".color-box.highlighted").id,
			newNote, currentNote;

	if(currentNoteId === 0){
			newNote = new Note(titleInput, descriptionInput, sourceInput, themeInput, colorInput);
	}else{
			currentNote = data.dataArray.filter(notes =>{
				return notes.id === currentNoteId;
			})[0];

			deleteNote(currentNoteId);

			newNote = new Note(titleInput, descriptionInput, sourceInput, themeInput, colorInput,
												currentNote.creationDate);
			newNote.setCreationDateNoFormat(currentNote.creationDateNoFormat);
	}

			data.addNoteToStorage(newNote);
			createNewMinimizedNote(newNote);

}

function createNewMinimizedNote(note){

		let newMinimizedNote = new MinimizedNote(note.id, note. title, note.description,
													note.theme, note.color, note.lastUpdated),
			newMinimizedNoteHTMLElement = newMinimizedNote.getHTMLElement();

	buttonNewNote.parentNode.insertBefore(newMinimizedNoteHTMLElement, buttonNewNote.nextSibling);

	newMinimizedNoteHTMLElement.addEventListener("click", function(){
		openFullNote(note.id);
	});

	closeNewNoteEditor();
}

function openFullNote(id){
	closeNewNoteEditor();

	let currentNote = data.getNoteById(id),
			fullNote = new FullNote(currentNote.title, currentNote.description,
									currentNote.source, currentNote.theme, currentNote.color,
									currentNote.lastUpdated, currentNote.creationDate),
			fullNoteHTMLElement = fullNote.getHTMLElement();
	noteFullWindow.appendChild(fullNoteHTMLElement);
	document.querySelector(".close-button").addEventListener("click", closeFullNote);
	document.querySelector(".edit-button").addEventListener("click", function(){
		buttonNewNoteDelete.classList.remove("hidden");
		editNote(currentNoteId);
	});
	currentNoteId = id;
}

function editNote(id){
	noteFull.setAttribute("id", id);
	let currentNote = data.getNoteById(id);

	document.getElementById("note-full").remove();

	document.querySelector(".note-editor-heading").innerHTML = "Zettel bearbeiten";
	openNoteEditor();

	document.getElementById("title-input").value = currentNote.title;
	document.querySelector(".ql-editor").innerHTML = currentNote.description;
	document.getElementById("source-input").value = currentNote.source;
	document.getElementById("theme-input").value = currentNote.theme;

	for(let i = 0; i < colorBoxes.length; i++){
		colorBoxes[i].classList.remove("highlighted");
	}
	document.getElementById(currentNote.color).classList.add("highlighted");

}





// localStorage -----------------------------------------------
function confirmDeletion(){
	confirmationDeletionWindow.classList.remove("hidden");
}

function deleteNote(id){
	confirmationDeletionWindow.classList.add("hidden");

	data.deleteNoteFromStorage(id);

	while(buttonNewNote.nextSibling){
		noteList.removeChild(buttonNewNote.nextSibling);
	}

	loadAllNotesToDOM();

	closeNewNoteEditor();
}

function loadAllNotesToDOM(){
	for(let i = 0; i < data.dataArray.length; i++){
		createNewMinimizedNote(data.dataArray[i]);
	}
	notesMinimized = document.getElementsByClassName("note-minimized");
}

//
//Suche, Sortierung & Filter
//
function searchNotes(){
	let filter, txtValue,
			lookup = {};

	for(let i = 0; i<data.dataArray.length; i++){
		lookup[data.dataArray[i].id] = data.dataArray[i];
	}

	filter = searchInput.value.toUpperCase();

	for(let i = 0; i<notesMinimized.length; i++){
		// txtValue = (notesMinimized[i].innerText || notesMinimized[i].textContent);
		let colorValue = translateColor(lookup[notesMinimized[i].id].color);

		txtValue = lookup[notesMinimized[i].id].title + lookup[notesMinimized[i].id].description +
							lookup[notesMinimized[i].id].source + lookup[notesMinimized[i].id].theme +
							colorValue + lookup[notesMinimized[i].id].creationDate +
							lookup[notesMinimized[i].id].lastUpdated;

		if(txtValue.toUpperCase().indexOf(filter) > -1){
			notesMinimized[i].classList.remove("search-hidden");
		}else{
			notesMinimized[i].classList.add("search-hidden");
		}
	}
}

function sortNotes(){
	while(buttonNewNote.nextSibling){
		noteList.removeChild(buttonNewNote.nextSibling);
	}
	switch(sortSelect.value){
		case "last-updated-asc":
			data.dataArray.sort(function(a,b){
				if(a.lastUpdatedNoFormat < b.lastUpdatedNoFormat) { return 1; }
				if(a.lastUpdatedNoFormat > b.lastUpdatedNoFormat) { return -1; }
				return 0;
			});
			break;
		case "last-updated-desc":
			data.dataArray.sort(function(a,b){
				if(a.lastUpdatedNoFormat < b.lastUpdatedNoFormat) { return -1; }
				if(a.lastUpdatedNoFormat > b.lastUpdatedNoFormat) { return 1; }
				return 0;
			});
			break;

		case "created-desc":
			data.dataArray.sort(function(a,b){
				if(a.creationDateNoFormat < b.creationDateNoFormat) { return -1; }
				if(a.creationDateNoFormat > b.creationDateNoFormat) { return 1; }
				return 0;
			});
			break;
		case "created-asc":
			data.dataArray.sort(function(a,b){
				if(a.creationDateNoFormat < b.creationDateNoFormat) { return 1; }
				if(a.creationDateNoFormat > b.creationDateNoFormat) { return -1; }
				return 0;
			});
			break;

		case "alphabetical-desc":
			data.dataArray.sort(function(a,b){
				if(a.title.toUpperCase() < b.title.toUpperCase()) { return -1; }
				if(a.title.toUpperCase() > b.title.toUpperCase()) { return 1; }
				return 0;
			});
			break;
		case "alphabetical-asc":
			data.dataArray.sort(function(a,b){
				if(a.title.toUpperCase() < b.title.toUpperCase()) { return 1; }
				if(a.title.toUpperCase() > b.title.toUpperCase()) { return -1; }
				return 0;
			});
			break;

		default:
			//do lastupdated-desc
			data.dataArray.sort(function(a,b){
				if(a.lastUpdatedNoFormat < b.lastUpdatedNoFormat) { return -1; }
				if(a.lastUpdatedNoFormat > b.lastUpdatedNoFormat) { return 1; }
				return 0;
			});
			break;
	}
	loadAllNotesToDOM();
	filterNotes(filterSelect.value);
	searchNotes();
}

function filterNotes(color){
	if(color === "nothing"){
		for(let i = 0; i < notesMinimized.length; i++){
			notesMinimized[i].classList.remove("filter-hidden");
		}
		return;
	}

	let txtValue,
			lookup = {};

	for(let i = 0; i<data.dataArray.length; i++){
		lookup[data.dataArray[i].id] = data.dataArray[i];
	}

	for(let i = 0; i<notesMinimized.length; i++){

		txtValue = lookup[notesMinimized[i].id].color;

		if(txtValue.indexOf(color) > -1){
			notesMinimized[i].classList.remove("filter-hidden");

		}else{
			notesMinimized[i].classList.add("filter-hidden");
		}
	}
}

function translateColor(color){
	switch(color){
		case "blue":
			return "blau";
		case "purple":
			return "lila";
		case "wine":
			return "weinrot";
		case "red":
			return "rot";
		case "green":
			return "grün";
		case "pink":
			return "pink";
		case "brown":
			return "braun";
		case "white":
			return "weiß";
		case "black":
			return "schwarz";
		default:
			return "";
	}
}








init();
