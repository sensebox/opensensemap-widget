# openSenseMap-Widget

This repository contains an embeddable widget for displaying [openSenseMap/senseBox](https://opensensemap.org) data.

## Usage
The usage of the widget is super easy and requires just two steps

### Step 1: Find your senseBox Id
Go to [https://opensensemap.org/](https://opensensemap.org/) and open a senseBox of your choice. Now copy the last portion of the address bar of your browser. This is your senseBox Id.

### Step 2: Insert HTML into your page
In order to include the widget into your web page, just include the following html into your page at the desired location.

Replace the `YOUR-SENSEBOX-OD` in the `src` attribute with the senseBox Id from step 1.
```html
<iframe
  src="https://sensebox.github.io/opensensemap-widget/iframe.html?senseboxId=YOUR-SENSEBOX-ID"
  width="400"
  height="600"
  marginwidth="8" marginheight="8"
  hspace="0" vspace="0"
  frameborder="0"
  scrolling="no"
></iframe>
```
You can play around with the `height` and `width` attributes.

## Example
[https://sensebox.de/opensensemap-widget/](https://sensebox.de/opensensemap-widget/)

Developed by by [ausDensk](https://github.com/ausDensk) in an internship over two weeks at senseBox.

# openSenseMap-Widget
Dieses Widget kann in eine Seite angebunden werden und zeigt dann dort Informationen zu einer ausgewählten,
auf der OpenSenseMap verzeichneten senseBox an. Um das Widget einzubinden, muss man einfach nur folgende Codezeilen
in sein HTML-Element einfügen:
```html
<iframe
  src="https://sensebox.github.io/opensensemap-widget/iframe.html?senseboxId=DEINE-SENSEBOXID"
  width="400"
  height="600"
  marginwidth="8" marginheight="8"
  hspace="0" vspace="0"
  frameborder="0"
  scrolling="no"
></iframe>
```

In der URL muss `DEINE-SENSEBOXID` durch die ID deiner Box ersetzt werden, wie sie auch in der OpenSenseMap
gespeichert ist. Anschließend ist das Widget sofort auf der Seite verfügbar.

Ein Beispiel, wie das Widget in der Praxis aussieht, kann man [hier](https://sensebox.de/opensensemap-widget/) begutachten.
