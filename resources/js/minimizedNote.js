/* eslint-env browser */

class MinimizedNode {

  constructor(id, title, description, theme, color, lastUpdated) {
    this.id = id;
    this.title = title;
    this.description = shortenDescription(description);
    this.theme = theme;
    this.color = color;
    this.lastUpdated = lastUpdated;
  }

  getHTMLElement(){
    let newMinimizedNote = document.createElement("div");
    newMinimizedNote.classList.add("note-minimized");
    newMinimizedNote.setAttribute("id", this.id);
    newMinimizedNote.innerHTML = getInnerHTML(this.title, this.description,
                                  this.theme, this.color, this.lastUpdated);
    return newMinimizedNote;
  }

}

function shortenDescription(description){
  let shortDescription = description;
  if(description.length > 100){
    shortDescription = description.substring(0, 100) + "...";
  }
  return shortDescription;
}

function getInnerHTML(title, description, theme, color, lastUpdated){
  return "<div class='title-minimized'>" + title + `</div>
  <div class="description-minimized">` + description + `</div>
  <div class="theme-minimized-title">` + theme + `</div>
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
    case "greem":
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
