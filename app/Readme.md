# Quellcode (Client)

Der gesamte Code teilt sich auf insgesamt 8 Javascript Dateien. 

* **quill.js** ist ein Framework, welches die Funktion eines Rich-Text-Editors bietet. Dieser Rich-Text-Editor wird in der Anwendung verwendet.
* **data.js** stellt die persistente Datenspeicherung dar. Diese wurde durch die localStorage-API realisiert. data.js wurde als Klasse realisiert und wird in anderen Javascript-Dateien importiert.
* **fullNote.js** stellt den Aufbau eines *vollen/kompletten/ganzen* Zettels dar und gibt auch den HTML-Aufbau des Zettels zurück. fullNote.js wurde als Klasse realisiert und wird in anderen Javascript-Dateien importiert.
* **minimizedNote.js** stellt die *minimierte* Version eines ganzen Zettel dar und gibt auch den HTML-Aufbau eines minimierten Zettels zurück. minimizedNote.js wurde als Klasse realisiert und wird in anderen Javascript-Dateien importiert.
* **note.js** stellt einen Zettel an sich mit allen Inhalten dar. note.js wurde als Klasse realisiert und wird von anderen Javascript-Dateien importiert. Durch deklarierung eines neuen note-Objekts, erstellt man einen neuen Zettel.
* **index.js, sources.js & themes.js** wird jeweils von deren respektiven HTML-Dokumenten (index.html, sources.html & themes.html) importiert und eingesetzt. Sie importieren teils die vorhin genannten Javascript-Klassen und regeln die Deklarierung von Buttons & Eventlistenern. Zudem werden hier Callback-Funktionen für die Eventlistener deklariert. Innerhalb der Dateien wird der Code auf verschiedene Ebenen aufgeteilt: Buttons & Declarations, Note/Sources/Themes functions, Storage functions, Search-Sort-Filter, URL parameters functions und Count number of notes/sources/themes.
 
