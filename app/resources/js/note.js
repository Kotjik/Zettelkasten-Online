/* eslint-env browser */

class Note {

  constructor(title, description, source, theme, color, creationDate, lastUpdated) {
    this.title = title || "[Kein Titel]";
    this.description = description || "[Keine Beschreibung]";
    this.source = source || "[Keine Quelle]";
    this.theme = theme || "[Kein Thema]";
    this.color = color || "blue";
    this.id = Date.now().toString();
    this.creationDate = creationDate || getDate();
    this.lastUpdated = lastUpdated || getDate();
    this.creationDateNoFormat = new Date();
    this.lastUpdatedNoFormat = new Date();
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

  setCreationDateNoFormat(date){
    this.creationDateNoFormat = new Date(date);
  }

  setLastUpdated(date){
    this.lastUpdated = date;
    this.lastUpdatedNoFormat = new Date();
  }
}

function getDate(date){
  let currentdate = new Date() || date,
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
