/* eslint-env browser */

class Note {

  constructor(title, description, source, theme, color, creationDate, lastUpdated) {
    this.title = title || "[Kein Titel]";
    this.description = description;
    this.source = source;
    this.theme = theme;
    this.color = color || "blue";
    this.id = Date.now().toString();
    this.creationDate = creationDate || getDate();
    this.lastUpdated = lastUpdated || getDate();
  }

  setTitle(title) {
    this.title = title;
  }

  setSource(source) {
    this.source = source;
  }

  setDescription(description) {
    this.description = description;
  }

  setTopic(topic) {
    this.topic = topic;
  }

  setColor(color) {
    this.color = color;
  }
}

function getDate(){
  let currentdate = new Date(),
      dd = currentdate.getDate(),
      mm = currentdate.getMonth()+1,
      yyyy = currentdate.getFullYear(),
      hh = currentdate.getHours(),
      min = currentdate.getMinutes(),
      twodigits = 10;

  if(dd<twodigits){
    dd = "0"+ dd;
  }
  if(mm<twodigits){
    mm = "0"+ mm;
  }
  if(hh<twodigits){
    hh = "0"+ hh;
  }
  if(min<twodigits){
    min = "0"+ min;
  }

  return dd + "." + mm + "." + yyyy + " " + hh + ":" + min;

}

export default Note;
