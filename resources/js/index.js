/* eslint-env browser */
import Note from "./note.js";
import Data from "./data.js";
import MinimizedNote from "./minimizedNote.js";
import FullNote from "./fullNote.js";

function init() {
    sortSelect.value = "last-updated-desc";
    filterSelect.value = "nothing";
    searchInput.value = "";
    loadAllNotesToDOM();
    sortNotes();
    checkURL();
    updateNumberOfNotes();
  }

//
// Buttons & declarations
//
let data = new Data(),
    currentNoteId = 0,
    notesContainer = document.querySelector(".notes-container"),
    buttonNewNote = document.getElementById("button-new-note"),
    buttonNewNoteCancel = document.getElementById("button-new-note-cancel"),
    buttonNewNoteSave = document.getElementById("button-new-note-save"),
    buttonNewNoteDelete = document.getElementById("button-new-note-delete"),
    buttonDeleteConfirm = document.getElementById("button-delete-confirm"),
    buttonDeleteCancel = document.getElementById("button-delete-cancel"),
    confirmationDeletionWindow = document.getElementById("confirmation-deletion"),
    noteFullWindow = document.getElementById("note-full-window"),
    newNoteEditor = document.getElementById("note-editor"),
    colorBoxes = document.getElementsByClassName("color-box"),
    notesMinimized = document.getElementsByClassName("note-minimized"),
    searchInput = document.querySelector("#searchInput"),
    sortSelect = document.querySelector("#sort-select"),
    filterSelect = document.querySelector("#filter-select"),
    numberOfNotes = document.querySelector(".number-of-notes"),
    deleteAllNotes = document.querySelector(".delete-all-notes"),
    deleteAllNotesConfirmation = document.querySelector(".delete-all-notes-confirmation"),
    deleteAllNotesConfirmationInput = document.querySelector("#delete-all-notes-confirmation-input"),
    deleteAllNotesConfirmationConfirm = document.querySelector("#delete-all-notes-confirmation-confirm"),
    deleteAllNotesConfirmationCancel = document.querySelector("#delete-all-notes-confirmation-cancel"),
    toolbarOptions = [
        ["bold", "italic", "underline", "strike"],
        [{
            "header": 1,
        }, {
            "header": 2,
        }],
        [{
            "list": "ordered",
        }, {
            "list": "bullet",
        }],
        [{
            "script": "sub",
        }, {
            "script": "super",
        }],
        [{
            "header": [1, 2, 3, 4, 5, 6, false],
        }],

        [{
            "color": [],
        }, {
            "background": [],
        }],
        ["clean"],
    ],
    // Rich Text-Editor "Quill". You have to use him like that; that's why we
    // can't erase the eslint error
    quill = new Quill("#description-input", {
        modules: {
            toolbar: toolbarOptions,
        },
        placeholder: "Beschreibung",
        theme: "snow",
    });

for (let i = 0; i < colorBoxes.length; i++) {
    colorBoxes[i].addEventListener("click", function() {
        for (let j = 0; j < colorBoxes.length; j++) {
            colorBoxes[j].classList.remove("highlighted");
        }
        colorBoxes[i].classList.add("highlighted");
    });
}

buttonNewNote.addEventListener("click", function() {
    closeFullNote();
    currentNoteId = 0;
    document.getElementById("title-input").value = "";
    document.getElementById("source-input").value = "";
    document.getElementById("theme-input").value = "";
    document.querySelector(".ql-editor").innerHTML = "";
    document.querySelector(".note-editor-heading").innerHTML = "Neuen Zettel anlegen";
    for (let i = 0; i < colorBoxes.length; i++) {
        colorBoxes[i].classList.remove("highlighted");
    }
    colorBoxes[0].classList.add("highlighted");
    notesMinimized = document.getElementsByClassName("note-minimized");
    for(let i=0; i<notesMinimized.length; i++){
      notesMinimized[i].classList.remove("highlighted");
    }
    currentNoteId = 0;
    confirmationDeletionWindow.classList.add("hidden");
    buttonNewNoteDelete.classList.add("hidden");

    openNoteEditor();
});
buttonNewNoteCancel.addEventListener("click", function() {
    closeNewNoteEditor();
    if(currentNoteId !== 0){
      openFullNote(currentNoteId);
    }
});
buttonNewNoteSave.addEventListener("click", saveNote);
buttonNewNoteDelete.addEventListener("click", function() {
    confirmDeletion();
    confirmationDeletionWindow.scrollIntoView({block: "start", behavior: "smooth"});
});
buttonDeleteConfirm.addEventListener("click", function() {
    deleteNote(currentNoteId);
});
buttonDeleteCancel.addEventListener("click", function() {
    confirmationDeletionWindow.classList.add("hidden");
});
searchInput.addEventListener("keyup", searchNotes);
sortSelect.addEventListener("change", sortNotes);
filterSelect.addEventListener("change", function() {
    filterNotes(filterSelect.value);
    filterSelect.className = filterSelect.value;
});

//
// Note functions
//
function closeFullNote() {
    if (document.getElementById("note-full")) {
        document.getElementById("note-full").remove();
    } else {
        return;
    }
}

function openNoteEditor() {
    newNoteEditor.classList.remove("hidden");
}

function closeNewNoteEditor() {
    confirmationDeletionWindow.classList.add("hidden");
    newNoteEditor.classList.add("hidden");

    document.getElementById("title-input").value = "";
    document.getElementById("description-input").value = "";
    document.getElementById("source-input").value = "";
    document.getElementById("theme-input").value = "";
    for (let i = 0; i < colorBoxes.length; i++) {
        colorBoxes[i].classList.remove("highlighted");
    }
    colorBoxes[0].classList.add("highlighted");
}

function saveNote() {
    let titleInput = document.getElementById("title-input").value.trim(),
        // descriptionInput = document.getElementById("description-input").value,
        descriptionInput = document.querySelector(".ql-editor").innerHTML,
        sourceInput = document.getElementById("source-input").value.trim(),
        themeInput = document.getElementById("theme-input").value.trim(),
        colorInput = document.querySelector(".color-box.highlighted").id,
        newNote, currentNote;

    if (currentNoteId === 0) {
        newNote = new Note(titleInput, descriptionInput, sourceInput, themeInput, colorInput);
    } else {
        currentNote = data.dataArray.filter(notes => {
            return notes.id === currentNoteId;
        })[0];

        deleteNote(currentNoteId);

        newNote = new Note(titleInput, descriptionInput, sourceInput, themeInput, colorInput,
            currentNote.creationDate);
        newNote.setCreationDateNoFormat(currentNote.creationDateNoFormat);
    }

    currentNoteId = newNote.id;
    data.addNoteToStorage(newNote);
    createNewMinimizedNote(newNote);
    sortNotes();
    // openFullNote(newNote.id);
    document.getElementById(newNote.id).click();
    document.getElementById(newNote.id).scrollIntoView({block: "start", behavior: "smooth"});
}

function createNewMinimizedNote(note) {

    let newMinimizedNote = new MinimizedNote(note.id, note.title, note.source,
            note.theme, note.color, note.lastUpdated),
        newMinimizedNoteHTMLElement = newMinimizedNote.getHTMLElement();

    // buttonNewNote.parentNode.insertBefore(newMinimizedNoteHTMLElement, buttonNewNote.nextSibling);
    notesContainer.appendChild(newMinimizedNoteHTMLElement);

    newMinimizedNoteHTMLElement.addEventListener("click", function() {
        openFullNote(note.id);
        let notesMinimized = document.getElementsByClassName("note-minimized");
        for (let i = 0; i < notesMinimized.length; i++) {
            notesMinimized[i].classList.remove("highlighted");
        }
        newMinimizedNoteHTMLElement.classList.add("highlighted");
    });

    closeNewNoteEditor();
}

function openFullNote(id) {
    closeFullNote();
    closeNewNoteEditor();

    let currentNote = data.getNoteById(id),
        fullNote = new FullNote(currentNote.title, currentNote.description,
            currentNote.source, currentNote.theme, currentNote.color,
            currentNote.lastUpdated, currentNote.creationDate),
        fullNoteHTMLElement = fullNote.getHTMLElement();
    noteFullWindow.appendChild(fullNoteHTMLElement);
    document.querySelector(".close-button").addEventListener("click", function(){
      closeFullNote();
      for(let i=0; i<notesMinimized.length; i++){
        notesMinimized[i].classList.remove("highlighted");
      }
      currentNoteId = 0;
    });
    document.querySelector(".edit-button").addEventListener("click", function() {
        buttonNewNoteDelete.classList.remove("hidden");
        editNote(currentNoteId);
    });
    document.querySelector(".color-box-full").addEventListener("click", function(){
      window.location = ".\\index.html?color=" + encodeURIComponent(currentNote.color);
    });
    currentNoteId = id;
}

function editNote(id) {
    let currentNote = data.getNoteById(id);

    closeFullNote();

    document.querySelector(".note-editor-heading").innerHTML = "Zettel bearbeiten";
    openNoteEditor();

    document.getElementById("title-input").value = currentNote.title;
    document.querySelector(".ql-editor").innerHTML = currentNote.description;
    document.getElementById("source-input").value = currentNote.source;
    document.getElementById("theme-input").value = currentNote.theme;

    for (let i = 0; i < colorBoxes.length; i++) {
        colorBoxes[i].classList.remove("highlighted");
    }
    document.getElementById(currentNote.color).classList.add("highlighted");
}

//
// Storage functions
//
function confirmDeletion() {
    confirmationDeletionWindow.classList.remove("hidden");
}

function deleteNote(id) {
    confirmationDeletionWindow.classList.add("hidden");

    data.deleteNoteFromStorage(id);

    while (notesContainer.firstChild) {
        notesContainer.removeChild(notesContainer.firstChild);
    }

    loadAllNotesToDOM();

    closeNewNoteEditor();
}

function loadAllNotesToDOM() {
    for (let i = 0; i < data.dataArray.length; i++) {
        createNewMinimizedNote(data.dataArray[i]);
    }
    notesMinimized = document.getElementsByClassName("note-minimized");
}

deleteAllNotes.addEventListener("click", function(){
  deleteAllNotesConfirmation.classList.remove("hidden");
  deleteAllNotesConfirmationInput.value = "";
});
deleteAllNotesConfirmationConfirm.addEventListener("click", function(){
  if(deleteAllNotesConfirmationInput.value === "DELETE"){
    localStorage.clear();
    init();
    deleteAllNotesConfirmationInput.value = "";
    deleteAllNotesConfirmation.classList.add("hidden");
  }else{
    return;
  }
});
deleteAllNotesConfirmationCancel.addEventListener("click", function(){
  deleteAllNotesConfirmationInput.value = "";
  deleteAllNotesConfirmation.classList.add("hidden");
});

//
// Search, Sort & Filter
//
function searchNotes() {
    let filter, txtValue,
        lookup = {},
        data = new Data();

    for (let i = 0; i < data.dataArray.length; i++) {
        lookup[data.dataArray[i].id] = data.dataArray[i];
    }

    filter = searchInput.value.toUpperCase();

    for (let i = 0; i < notesMinimized.length; i++) {
        let colorValue = translateColor(lookup[notesMinimized[i].id].color);

        txtValue = lookup[notesMinimized[i].id].title + stripHTMLTags(lookup[notesMinimized[i].id].description) +
            lookup[notesMinimized[i].id].source + lookup[notesMinimized[i].id].theme +
            colorValue + lookup[notesMinimized[i].id].creationDate +
            lookup[notesMinimized[i].id].lastUpdated;

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            notesMinimized[i].classList.remove("search-hidden");
        } else {
            notesMinimized[i].classList.add("search-hidden");
        }
    }
    updateNumberOfNotes();
}

function stripHTMLTags(str){
  let result = "";
  if((str===null) || (str==="")){
    result = "[Keine Beschreibung]";
  }else{
    result = str.toString();
  }
  return result.replace(/<[^>]*>/g, "");
}

function sortNotes() {
    data = new Data();
    while (notesContainer.firstChild) {
        notesContainer.removeChild(notesContainer.firstChild);
    }
    switch (sortSelect.value) {
        case "last-updated-asc":
            data.dataArray.sort(function(a, b) {
                if (a.lastUpdatedNoFormat < b.lastUpdatedNoFormat) {
                    return -1;
                }
                if (a.lastUpdatedNoFormat > b.lastUpdatedNoFormat) {
                    return 1;
                }
                return 0;
            });
            break;
        case "last-updated-desc":
            data.dataArray.sort(function(a, b) {
                if (a.lastUpdatedNoFormat < b.lastUpdatedNoFormat) {
                    return 1;
                }
                if (a.lastUpdatedNoFormat > b.lastUpdatedNoFormat) {
                    return -1;
                }
                return 0;
            });
            break;

        case "created-asc":
            data.dataArray.sort(function(a, b) {
                if (a.creationDateNoFormat < b.creationDateNoFormat) {
                    return -1;
                }
                if (a.creationDateNoFormat > b.creationDateNoFormat) {
                    return 1;
                }
                return 0;
            });
            break;
        case "created-desc":
            data.dataArray.sort(function(a, b) {
                if (a.creationDateNoFormat < b.creationDateNoFormat) {
                    return 1;
                }
                if (a.creationDateNoFormat > b.creationDateNoFormat) {
                    return -1;
                }
                return 0;
            });
            break;

        case "alphabetical-asc":
            data.dataArray.sort(function(a, b) {
                if (a.title.toUpperCase() < b.title.toUpperCase()) {
                    return -1;
                }
                if (a.title.toUpperCase() > b.title.toUpperCase()) {
                    return 1;
                }
                return 0;
            });
            break;
        case "alphabetical-desc":
            data.dataArray.sort(function(a, b) {
                if (a.title.toUpperCase() < b.title.toUpperCase()) {
                    return 1;
                }
                if (a.title.toUpperCase() > b.title.toUpperCase()) {
                    return -1;
                }
                return 0;
            });
            break;

        default:
            //do lastupdated-desc
            data.dataArray.sort(function(a, b) {
                if (a.lastUpdatedNoFormat < b.lastUpdatedNoFormat) {
                    return -1;
                }
                if (a.lastUpdatedNoFormat > b.lastUpdatedNoFormat) {
                    return 1;
                }
                return 0;
            });
            break;
    }
    loadAllNotesToDOM();
    filterNotes(filterSelect.value);
    searchNotes();
    if(currentNoteId !== 0){
      document.getElementById(currentNoteId).click();
      document.getElementById(currentNoteId).scrollIntoView({block: "start", behavior: "smooth"});
    }
}

function filterNotes(color) {
    if (color === "nothing") {
        for (let i = 0; i < notesMinimized.length; i++) {
            notesMinimized[i].classList.remove("filter-hidden");
        }
        updateNumberOfNotes();
        return;
    }

    let txtValue,
        lookup = {};

    for (let i = 0; i < data.dataArray.length; i++) {
        lookup[data.dataArray[i].id] = data.dataArray[i];
    }

    for (let i = 0; i < notesMinimized.length; i++) {

        txtValue = lookup[notesMinimized[i].id].color;

        if (txtValue.indexOf(color) > -1) {
            notesMinimized[i].classList.remove("filter-hidden");

        } else {
            notesMinimized[i].classList.add("filter-hidden");
        }
    }
    updateNumberOfNotes();
}

function translateColor(color) {
    switch (color) {
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

//
// URL parameters functions
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
  if(getURLVariable("edit")){
    document.getElementById(getURLVariable("edit")).click();
    document.querySelector(".edit-button").click();
    document.querySelector(".note-minimized.highlighted").scrollIntoView({block: "start", behavior: "smooth"});
  }else if(getURLVariable("color")){
    filterSelect.value = getURLVariable("color");
    filterNotes(getURLVariable("color"));
    filterSelect.className = filterSelect.value;
  }
}

//
// Count found notes
//
function updateNumberOfNotes(){
  let notesMinimized = document.getElementsByClassName("note-minimized"),
      counter = 0;
  for(let i=0; i<notesMinimized.length; i++){
    if(!notesMinimized[i].classList.contains("hidden") &&
       !notesMinimized[i].classList.contains("filter-hidden") &&
       !notesMinimized[i].classList.contains("search-hidden")){
      counter++;
    }
  }
  numberOfNotes.innerHTML = "Zettel gefunden: " + counter;
}

init();
