/* eslint-env browser */

import Data from "./data.js";
import MinimizedNote from "./minimizedNote.js";
import FullNote from "./fullNote.js";

function init() {
	//
  loadAllThemesToDOM();
  checkURL();
  sortSelect.value = "alphabetical-asc";
}

// Buttons & Declarations
let data = new Data(),
    themeList = document.getElementById("theme-list"),
    noteFullWindow = document.getElementById("note-full-window"),
    allThemes = [],
    uniqueThemes = [],
    themeEntries = document.getElementsByClassName("theme-entry"),
    searchInput = document.querySelector("#searchInput"),
    sortSelect = document.querySelector("#sort-select"),
    notesContainer = document.querySelector(".notes-container");

for(let i = 0; i < data.dataArray.length; i++){
  allThemes.push(data.dataArray[i].theme);
}
uniqueThemes = [...new Set(allThemes)];
uniqueThemes.sort(function(a,b){
  if(a.toUpperCase() < b.toUpperCase()) { return -1; }
  if(a.toUpperCase() > b.toUpperCase()) { return 1; }
  return 0;
});

searchInput.addEventListener("keyup", searchThemes);

sortSelect.addEventListener("change", sortNotes);

// functions

function countDuplicates(array, element){
  let count = 0;
  for(let i = 0; i<array.length; i++){
    if(array[i] === element){
      count++;
    }
  }
  return count;
}

function createNewMinimizedTheme(theme, numberOfNotes){
  let newMinimizedTheme = document.createElement("div");
	newMinimizedTheme.classList.add("theme-entry");
	newMinimizedTheme.setAttribute("id", theme);

  if(theme){
    newMinimizedTheme.innerHTML =
		"<div class='theme-minimized'>" + theme + `</div>
		<div class="numberOfNotes-minimized"> Notizenanzahl:` + numberOfNotes + "</div>";
  }else{
    newMinimizedTheme.innerHTML =
    `<div class='theme-minimized'>[Kein Thema angegeben]</div>
  	<div class="numberOfNotes-minimized"> Notizenanzahl:` + numberOfNotes + "</div>";
  }

	notesContainer.appendChild(newMinimizedTheme);

	newMinimizedTheme.addEventListener("click", function(){
		showNotes(theme, numberOfNotes);

    let minimizedThemes = document.getElementsByClassName("theme-entry");
    for(let i = 0; i < minimizedThemes.length; i++){
      minimizedThemes[i].classList.remove("highlighted");
    }
    newMinimizedTheme.classList.add("highlighted");
	});
}

function showNotes(theme, numberOfNotes){

  while(noteFullWindow.firstChild){
		noteFullWindow.removeChild(noteFullWindow.firstChild);
	}

  let notesWithThisThemes = [];
  for(let i = 0; i < data.dataArray.length; i++){
    if(data.dataArray[i].theme === theme){
      notesWithThisThemes.push(data.dataArray[i]);
    }
  }

  for(let i = 0; i<numberOfNotes; i++){

    let currentNote = notesWithThisThemes[i];
    createNewMinimizedNote(currentNote);
  }

  themeEntries = document.getElementsByClassName("theme-entry");
}

function createNewMinimizedNote(note){
  let newMinimizedNote = new MinimizedNote(note.id, note.title,
      note.source, note.theme, note.color,
      note.lastUpdated),
  newMinimizedNoteHTMLElement = newMinimizedNote.getHTMLElement();

  noteFullWindow.appendChild(newMinimizedNoteHTMLElement);

  newMinimizedNoteHTMLElement.addEventListener("click", function(){
    openFullNote(note.id);
  });
}

function openFullNote(id){
  let minimizedNotes = document.getElementsByClassName("note-minimized"),
      currentNote = data.getNoteById(id),
      fullNote = new FullNote(currentNote.title, currentNote.description,
                  currentNote.source, currentNote.theme, currentNote.color,
                  currentNote.lastUpdated, currentNote.creationDate),
      fullNoteHTMLElement = fullNote.getHTMLElement();

  for(let i = 0; i<minimizedNotes.length; i++){
    minimizedNotes[i].classList.add("hidden");
  }
  noteFullWindow.appendChild(fullNoteHTMLElement);

  document.querySelector(".close-button").addEventListener("click", function(){
    fullNote.closeFullNote();
    for(let i = 0; i<minimizedNotes.length; i++){
      minimizedNotes[i].classList.remove("hidden");
    }
  });
  document.querySelector(".edit-button").addEventListener("click", function(){
    window.location = ".\\index.html?id=" + encodeURIComponent(id);
  });
}

function loadAllThemesToDOM(){
  for(let i = 0; i < uniqueThemes.length; i++){
    createNewMinimizedTheme(uniqueThemes[i], countDuplicates(allThemes, uniqueThemes[i]));
  }
}

//
// Thema geklick
//
function getURLVariable(variable){
  let query = window.location.search.substring(1),
      vars = query.split("&");
  for(let i=0;i<vars.length;i++) {
    let pair = vars[i].split("=");
    if(pair[0] === variable){return pair[1];}
  }
  return(false);
}

function checkURL(){
  if(getURLVariable("theme")){
    searchInput.value = decodeURIComponent(getURLVariable("theme"));
    searchThemes();
    for(let i = 0; i < themeEntries.length; i++){
      if(window.getComputedStyle(themeEntries[i]).display !== "none"){
        themeEntries[i].click();
      }
    }
    searchInput.value = "";
    searchThemes();
    document.querySelector(".theme-entry.highlighted").scrollIntoView({block: "start", behavior: "smooth"});
  }
}

//
//Suche & Sortierung
//
function searchThemes(){
	let filter, txtValue,
			lookup = {};

	for(let i = 0; i<data.dataArray.length; i++){
		lookup[data.dataArray[i].id] = data.dataArray[i];
	}

	filter = searchInput.value.toUpperCase();

	for(let i = 0; i<themeEntries.length; i++){
		txtValue = (themeEntries[i].firstChild.innerText || themeEntries[i].firstChild.textContent);

		if(txtValue.toUpperCase().indexOf(filter) > -1){
      themeEntries[i].classList.remove("search-hidden");
		}else{
      themeEntries[i].classList.add("search-hidden");
		}
	}
}

function sortNotes(){
  while(notesContainer.firstChild){
		notesContainer.removeChild(notesContainer.firstChild);
	}
	switch(sortSelect.value){
		case "notesnumber-desc":
			uniqueThemes.sort(function(a,b){
				if(countDuplicates(allThemes, a) < countDuplicates(allThemes, b)) { return 1; }
				if(countDuplicates(allThemes, a) > countDuplicates(allThemes, b)) { return -1; }
				return 0;
			});
			break;
		case "notesnumber-asc":
			uniqueThemes.sort(function(a,b){
				if(countDuplicates(allThemes, a) < countDuplicates(allThemes, b)) { return -1; }
				if(countDuplicates(allThemes, a) > countDuplicates(allThemes, b)) { return 1; }
				return 0;
			});
			break;

		case "alphabetical-desc":
			uniqueThemes.sort(function(a,b){
        if(a.toUpperCase() < b.toUpperCase()) { return 1; }
				if(a.toUpperCase() > b.toUpperCase()) { return -1; }
				return 0;
			});
			break;
		case "alphabetical-asc":
			uniqueThemes.sort(function(a,b){
        if(a.toUpperCase() < b.toUpperCase()) { return -1; }
				if(a.toUpperCase() > b.toUpperCase()) { return 1; }
				return 0;
			});
			break;

		default:
			//do alphabetical-asc
			uniqueThemes.sort(function(a,b){
        if(a.toUpperCase() < b.toUpperCase()) { return -1; }
				if(a.toUpperCase() > b.toUpperCase()) { return 1; }
				return 0;
			});
			break;
	}
	loadAllThemesToDOM();
  searchThemes();
}



init();
