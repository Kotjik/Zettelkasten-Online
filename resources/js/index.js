/* eslint-env browser */

import Note from "./note.js";
import Data from "./data.js";
import MinimizedNote from "./minimizedNote.js";

function init() {
	console.log(data.dataArray);

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
		quill = new Quill('#description-input', {
			modules: {
				toolbar: true,
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
	document.querySelector(".note-editor-heading").innerHTML = "Neuen Zettel anlegen";
	buttonNewNoteDelete.classList.add("hidden");
	openNoteEditor();
});
buttonNewNoteCancel.addEventListener("click", closeNewNoteEditor);
buttonNewNoteSave.addEventListener("click", saveNote);
closeButton.addEventListener("click", closeFullNote);
editButton.addEventListener("click", function(){
	buttonNewNoteDelete.classList.remove("hidden");
	editNote(currentNoteId);
});
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

	let currentNote = data.dataArray.filter(notes =>{
		return notes.id === id;
	})[0];

	currentNoteId = id;

	document.querySelector(".title-full").innerHTML = currentNote.title;
	document.querySelector(".description-full").innerHTML = currentNote.description;
	document.querySelector(".color-box-full").setAttribute("class", "color-box-full " + currentNote.color);
	// document.querySelector(".source-full").innerHTML = "<b>Quelle</b>: " + currentNote.source;
	document.querySelector(".source-full").innerHTML = "<b>Quelle</b>: <a href=\".\\sources.html?source="
						+ currentNote.source + "\">" + currentNote.source + "</a>";
	// document.querySelector(".theme-full").innerHTML = "<b>Thema</b>: " + currentNote.theme;
	document.querySelector(".theme-full").innerHTML = "<b>Thema</b>: <a href=\".\\themes.html?theme="
						+ currentNote.theme + "\">" + currentNote.theme + "</a>";
	document.querySelector(".last-updated-full").innerHTML = "Zuletzt bearbeitet: " + currentNote.lastUpdated;
	document.querySelector(".creation-full").innerHTML = "Erstellt: " + currentNote.creationDate;

	noteFull.classList.remove("hidden");
}

function editNote(id){
	noteFull.setAttribute("id", id);
	let currentNote = data.dataArray.filter(notes =>{
		return notes.id === id;
	})[0];

	noteFull.classList.add("hidden");

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
// Suchfunktion
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
		let colorValue;
		switch(lookup[notesMinimized[i].id].color){
			case "blue":
				colorValue = "blau";
				break;
			case "purple":
				colorValue = "lila";
				break;
			case "wine":
				colorValue = "weinrot";
				break;
			case "red":
				colorValue = "rot";
				break;
			case "greem":
				colorValue = "grün";
				break;
			case "pink":
				colorValue = "pinkrosa";
				break;
			case "brown":
				colorValue = "braun";
				break;
			case "white":
				colorValue = "weißweiss";
				break;
			case "black":
				colorValue = "schwarz";
				break;
			default:
				colorValue = "blaulilaweinrotgrünpinkroasbraunweißweissschwarz";
				break;
		}

		txtValue = lookup[notesMinimized[i].id].title + lookup[notesMinimized[i].id].description +
							lookup[notesMinimized[i].id].source + lookup[notesMinimized[i].id].theme +
							colorValue + lookup[notesMinimized[i].id].creationDate +
							lookup[notesMinimized[i].id].lastUpdated;

		if(txtValue.toUpperCase().indexOf(filter) > -1){
			notesMinimized[i].style.display = "";
		}else{
			notesMinimized[i].style.display = "none";
		}
	}
}

//
//Sortierfunktion
//
function sortNotes(){
	while(buttonNewNote.nextSibling){
		noteList.removeChild(buttonNewNote.nextSibling);
	}
	switch(sortSelect.value){
		case "last-updated":
			data.dataArray.sort(function(a,b){
				if(a.creationDate < b.creationDate) { return -1; }
				if(a.creationDate > b.creationDate) { return 1; }
				return 0;
			});
			loadAllNotesToDOM();
			break;

		case "created":
			data.dataArray.sort(function(a,b){
				return a.creationDate - b.creationDate;
			});
			loadAllNotesToDOM();
			break;

		case "alphabetical":
			data.dataArray.sort(function(a,b){
				if(a.title.toUpperCase() < b.title.toUpperCase()) { return 1; }
				if(a.title.toUpperCase() > b.title.toUpperCase()) { return -1; }
				return 0;
			});
			loadAllNotesToDOM();
			break;

		default:
			//do lastupdated
			data.dataArray.sort(function(a,b){
				if(a.lastUpdated < b.lastUpdated) { return 1; }
				if(a.lastUpdated > b.lastUpdated) { return -1; }
				return 0;
			});
			loadAllNotesToDOM();
			break;
	}
}












init();
