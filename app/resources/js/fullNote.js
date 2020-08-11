/* eslint-env browser */

class FullNote {

  constructor(title, description, source, theme, color, lastUpdated, creationDate) {
    this.title = title;
    this.description = description;
    this.source = source;
    this.theme = theme;
    this.color = color;
    this.lastUpdated = lastUpdated;
    this.creationDate = creationDate;
  }

  getHTMLElement(){
    let newFullNote = document.createElement("div");
    newFullNote.setAttribute("id", "note-full");
    newFullNote.classList.add("note-full");
    newFullNote.innerHTML = getInnerHTML(this.title, this.description, this.source,
                this.theme, this.color, this.lastUpdated, this.creationDate);
    return newFullNote;
  }

  closeFullNote(){
    if(document.getElementById("note-full")){
      document.getElementById("note-full").remove();
    }else{
      return;
    }
  }
}

function getInnerHTML(title, description, source, theme, color, lastUpdated, creationDate){
  return "<div class='title-full'>" + title + `</div>
  <div class="description-full">` + description + `</div>
  <div class="source-full">
    Quelle: <a title="Alle Zettel mit dieser Quelle anzeigen" href=".\\sources.html?source=` + encodeURIComponent(source) + "\">"
    + source + `</a>
  </div>
  <div class="theme-full">
    Thema: <a title="Alle Zettel mit diesem Thema anzeigen" href=".\\themes.html?theme=` + encodeURIComponent(theme) + "\">"
    + theme + `</a>
  </div>
  <div class='color-box-full ` + color + `' title='Alle Zettel mit dieser Farbe anzeigen'></div>
  <div class='last-updated-full'>Zuletzt bearbeitet: ` + lastUpdated + `</div>
  <div class="creation-full">Erstellt: ` + creationDate + `</div>
  <div class="close-button">×</div>
  <div class="edit-button">&#9998; Zettel bearbeiten</div>`;
}

export default FullNote;
