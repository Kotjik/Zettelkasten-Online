/* eslint-env browser */

/* https://wiki.selfhtml.org/wiki/JavaScript/Web_Storage */

class Data {

  constructor() {
    this.dataArray = getNotesFromStorage();
  }

  addNoteToStorage(note) {
    this.dataArray.push(note);
    localStorage.clear();
    localStorage.setItem("notesArray", JSON.stringify(this.dataArray));
  }

  deleteNoteFromStorage(id){
    let currentNote = this.dataArray.filter(notes =>{
      return notes.id === id;
    })[0];

    for(let i = 0; i < this.dataArray.length; i++){
      if(this.dataArray[i] === currentNote){
        this.dataArray.splice(i, 1);
      }
    }
    localStorage.clear();
    localStorage.setItem("notesArray", JSON.stringify(this.dataArray));
  }

  setItem(key, value){
    localStorage.setItem(key, value);
  }

  getItem(key){
    return localStorage.getItem(key);
  }

  removeItem(key){
    localStorage.removeItem(key);
  }
}

function getNotesFromStorage(){
  let notesArray = localStorage.getItem("notesArray");
  if(!notesArray){
    notesArray = [];
    localStorage.setItem("notesArray", JSON.stringify(notesArray));
  }else{
    notesArray = JSON.parse(notesArray);
  }
  return notesArray;
}

export default Data;
