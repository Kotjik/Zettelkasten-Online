# Zettelkasten Online

## Features

| Feature | Beschreibung | Priorität | Geschätzter Aufwand | Betroffen Schichten |
|---------|--------------|-----------|--------------------|---------------------|
| **Anlegen eines Zettels** | Nutzer können jederzeit einen neuen Zettel erstellen, der aus folgenden Aspekten besteht: ein Titel; einer optionalen Beschreibung (Gedanken, Thesen, Aussagen, Notizen etc.), der zugehörigen Quelle; eines übergeordneten, optionalen Themas; einer Standardfarbe, die ebenfalls optional wählbar ist. | hoch (kritisch) | 1 Tag | UI, Datenbank, Javascript |
| **Datenspeicherung im Browser** | Der im vorherigen Schritt angelegte Zettel wird im localStorage des Browsers persistent gespeichert. | hoch (kritisch) | 0.5 Tage | Datenbank, Javascript |
| **Zettel bearbeiten** | Nutzer können angelegte Zettel bearbeiten. Dabei besteht die Möglichkeit innerhalb der Beschreibung bestimmte Stellen hervorzuheben (fett, kursiv, etc.). Außerdem kann die Standardfarbe, durch eine vorgegebene Auswahl unterschiedlicher Farben verändert werden. Zudem kann nachträglich das Thema und die Quelle angepasst werden.| mittel (unkritisch) | 0.5 Tage | UI, Datenbank, Javascript |
| **Zettel öffnen und schließen** | Nutzer können angelegte Zettel auswählen, um eine detaillierte Ansicht zu öffnen und anschließend wieder schließen. | hoch (kritisch) | 0.5 Tage | Javascript, UI (Datenbank) |
| **Zettel verlinken** | Nutzer können über das Klicken auf das Thema des vorliegenden Zettels sich eine Liste mit weiteren Zettel des jeweiligen Themas anzeigen lassen. Diese Liste bietet außerdem die Möglichkeit ein Zettel auszuwähnlen und anzeigen zu lassen.  | niedrig (unkritisch) | 0.5 Tage | UI, Javascript (Datenbank) |
| **Zettel sortieren** | Nutzer können die Reihenfolge der Zettelansicht nach bestimmten Kriterien sortiern. Diese wären nach dem Alphabet, nach dem Erstellungsdatum oder nach dem Änderungsdatum. | niedrig (unkritisch) | 0.5 Tage | Javascript, UI, Datenbank |
| **Zettel filtern** | Über eine Sucheingabe, in der Begriffe oder Farben eingegen werden, können Zettel gefiltert werden. | niedrig (unkritisch) | 0.5 Tage | UI, Javascript, Datenbank |
| **Zettel löschen** | Irrelevante Zettel können aus der Datenbank persistent gelöscht werden. | niedrig (unkritisch) | 0.5 Tage | UI, Javascript, Datenbank |
| **Anzeigen aller Quellen** | Nutzer können sich alle eingetragenen Quellen in einer Art Quellenverzeichnis anzeigen lassen. | niedrig (unkritisch) | 0.5 | UI, Datenbank |
