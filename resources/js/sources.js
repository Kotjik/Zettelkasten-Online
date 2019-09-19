/* eslint-env browser */

import Data from "./data.js";
import MinimizedNode from "./minimizedNote.js";

function init() {
	//
  loadAllSourcesToDOM();
  checkURL();
}

// Buttons & Declarations
let data = new Data(),
    sourceList = document.getElementById("source-list"),
    noteFullWindow = document.getElementById("note-full-window"),
    allSources = [],
    uniqueSources = [],
    searchInput = document.querySelector("#searchInput"),
    sourcesMinimized = document.getElementsByClassName("source-minimized");

for(let i = 0; i < data.dataArray.length; i++){
  allSources.push(data.dataArray[i].source);
}
uniqueSources = [...new Set(allSources)];

searchInput.addEventListener("keyup", searchSources);

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

function createNewMinimizedSource(source, numberOfNotes){
  let newMinimizedSource = document.createElement("div");
	newMinimizedSource.classList.add("source-minimized");
	newMinimizedSource.setAttribute("id", source);

  if(source){
    newMinimizedSource.innerHTML =
		"<div class='theme-minimized-title'>" + source + `</div>
		<div class="numberOfNotes-minimized"> Notizenanzahl:` + numberOfNotes + "</div>";
  }else{
    newMinimizedSource.innerHTML =
    `<div class='theme-minimized-title'>[Keine Quelle angegeben]</div>
  	<div class="numberOfNotes-minimized"> Notizenanzahl:` + numberOfNotes + "</div>";
  }

	sourceList.appendChild(newMinimizedSource);

	newMinimizedSource.addEventListener("click", function(){
		showNotes(source, numberOfNotes);

    let minimizedSources = document.getElementsByClassName("source-minimized");
    for(let i = 0; i < minimizedSources.length; i++){
      minimizedSources[i].classList.remove("highlighted");
    }
    newMinimizedSource.classList.add("highlighted");
	});
}

function showNotes(source, numberOfNotes){

  while(noteFullWindow.firstChild){
		noteFullWindow.removeChild(noteFullWindow.firstChild);
	}

  let notesWithThisSource = [];
  for(let i = 0; i < data.dataArray.length; i++){
    if(data.dataArray[i].source === source){
      notesWithThisSource.push(data.dataArray[i]);
    }
  }

  for(let i = 0; i<numberOfNotes; i++){

    let currentNote = notesWithThisSource[i];
    createNewMinimizedNote(currentNote);

  }

  sourcesMinimized = document.getElementsByClassName("source-minimized");
}

function createNewMinimizedNote(note){
  let newMinimizedNote = new MinimizedNode(note.id, note. title,
    note.description, note.theme, note.color,
    note.lastUpdated),
  newMinimizedNoteHTMLElement = newMinimizedNote.getHTMLElement();

  noteFullWindow.appendChild(newMinimizedNoteHTMLElement);

}

function loadAllSourcesToDOM(){
  for(let i = 0; i < uniqueSources.length; i++){
    createNewMinimizedSource(uniqueSources[i], countDuplicates(allSources, uniqueSources[i]));
  }
}

//
// Suchfunktion
//
function searchSources(){
	let filter, txtValue,
			lookup = {};

	for(let i = 0; i<data.dataArray.length; i++){
		lookup[data.dataArray[i].id] = data.dataArray[i];
	}

	filter = searchInput.value.toUpperCase();

	for(let i = 0; i<sourcesMinimized.length; i++){
		txtValue = (sourcesMinimized[i].firstChild.innerText || sourcesMinimized[i].firstChild.textContent);

		if(txtValue.toUpperCase().indexOf(filter) > -1){
			sourcesMinimized[i].style.display = "";
		}else{
			sourcesMinimized[i].style.display = "none";
		}
	}
}

//
// URL
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
  if(getURLVariable("source")){
    searchInput.value = getURLVariable("source");
    searchSources();
    for(let i = 0; i < sourcesMinimized.length; i++){
      if(window.getComputedStyle(sourcesMinimized[i]).display !== "none"){
        sourcesMinimized[i].click();
      }
    }
    searchInput.value = "";
    searchSources();
  }
}







init();
