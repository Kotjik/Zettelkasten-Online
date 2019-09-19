/* eslint-env browser */

import Data from "./data.js";
import MinimizedNode from "./minimizedNote.js";

function init() {
	//
  loadAllThemesToDOM();
  checkURL();
}

// Buttons & Declarations
let data = new Data(),
    themeList = document.getElementById("theme-list"),
    noteFullWindow = document.getElementById("note-full-window"),
    allThemes = [],
    uniqueThemes = [],
    themesMinimized = document.getElementsByClassName("theme-minimized"),
    searchInput = document.querySelector("#searchInput");

for(let i = 0; i < data.dataArray.length; i++){
  allThemes.push(data.dataArray[i].theme);
}
uniqueThemes = [...new Set(allThemes)];

searchInput.addEventListener("keyup", searchThemes);

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
	newMinimizedTheme.classList.add("theme-minimized");
	newMinimizedTheme.setAttribute("id", theme);

  if(theme){
    newMinimizedTheme.innerHTML =
		"<div class='theme-minimized-title'>" + theme + `</div>
		<div class="numberOfNotes-minimized"> Notizenanzahl:` + numberOfNotes + "</div>";
  }else{
    newMinimizedTheme.innerHTML =
    `<div class='theme-minimized-title'>[Kein Thema angegeben]</div>
  	<div class="numberOfNotes-minimized"> Notizenanzahl:` + numberOfNotes + "</div>";
  }

	themeList.appendChild(newMinimizedTheme);

	newMinimizedTheme.addEventListener("click", function(){
		showNotes(theme, numberOfNotes);

    let minimizedThemes = document.getElementsByClassName("theme-minimized");
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

    let currentNote = notesWithThisThemes[i],
    newMinimizedNote =new MinimizedNode(currentNote.id, currentNote. title,
      currentNote.description, currentNote.theme, currentNote.color,
      currentNote.lastUpdated),
    newMinimizedNoteHTMLElement = newMinimizedNote.getHTMLElement();

    noteFullWindow.appendChild(newMinimizedNoteHTMLElement);
  }

  themesMinimized = document.getElementsByClassName("theme-minimized");
}

function loadAllThemesToDOM(){
  for(let i = 0; i < uniqueThemes.length; i++){
    createNewMinimizedTheme(uniqueThemes[i], countDuplicates(allThemes, uniqueThemes[i]));
  }
}

//
// Suchfunktion
//
function searchThemes(){
	let filter, txtValue,
			lookup = {};

	for(let i = 0; i<data.dataArray.length; i++){
		lookup[data.dataArray[i].id] = data.dataArray[i];
	}

	filter = searchInput.value.toUpperCase();

	for(let i = 0; i<themesMinimized.length; i++){
		txtValue = (themesMinimized[i].firstChild.innerText || themesMinimized[i].firstChild.textContent);

		if(txtValue.toUpperCase().indexOf(filter) > -1){
			themesMinimized[i].style.display = "";
		}else{
			themesMinimized[i].style.display = "none";
		}
	}
}

//
//
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
    searchInput.value = getURLVariable("theme");
    searchThemes();
    for(let i = 0; i < themesMinimized.length; i++){
      if(window.getComputedStyle(themesMinimized[i]).display !== "none"){
        themesMinimized[i].click();
      }
    }
    searchInput.value = "";
    searchThemes();
  }
}





init();