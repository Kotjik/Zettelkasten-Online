/* eslint-env browser */

class MinimizedNode {

  constructor(id, title, source, theme, color, lastUpdated) {
    this.id = id;
    this.title = shortenString(title);
    this.source = shortenString(source);
    this.theme = shortenString(theme);
    this.color = color;
    this.lastUpdated = lastUpdated;
  }

  getHTMLElement(){
    let newMinimizedNote = document.createElement("div");
    newMinimizedNote.classList.add("note-minimized");
    newMinimizedNote.setAttribute("id", this.id);
    newMinimizedNote.innerHTML = getInnerHTML(this.title, this.source,
                                  this.theme, this.color, this.lastUpdated);
    return newMinimizedNote;
  }

}

function shortenString(string){
  let shortDescription = string;
  if(string.length > 100){
    shortDescription = string.substring(0, 100) + "...";
  }
  return shortDescription;
}

function getInnerHTML(title, source, theme, color, lastUpdated){
  return "<div class='title-minimized'>" + title + `</div>
  <div class="source-minimized">` + source + `</div>
  <div class="theme-minimized">` + theme + `</div>
  <div class='color-box-minimized ` + color + "' title='" + translateColor(color) + `'></div>
  <div class='date-minimized'>Zuletzt bearbeitet: ` + lastUpdated + "</div>";
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
      return "weißweiss";
    case "black":
      return "schwarz";
    default:
      return "";
  }
}

export default MinimizedNode;
