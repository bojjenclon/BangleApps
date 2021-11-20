const locale = require("locale");
const storage = require('Storage');
const settings = (storage.readJSON('setting.json', 1) || {});
const is12Hour = settings["12hour"] || false;

const isDarkTheme = g.theme.dark;
const clearColor = isDarkTheme ? 0x780F : 0x000F;
const textColor = isDarkTheme ? 0xFD20 : 0xFFE0;
const hourHandColor = isDarkTheme  ? 0xC618 : 0x780F;
const minuteHandColor = isDarkTheme  ? 0x7800 : 0x07FF;

const hourHandLength = 18;
const minuteHandLength = 32;

const hourRevolutions = 360 / (60 * 24 / 2);
const minuteRevolutions = 360 / 60;

function drawBackground() {
  if (!Bangle.isLCDOn()) {
    return;
  }

  // g.drawImage(bg, 0, g.getHeight() - bg.height);
}

function drawFace() {
  g.setFont('6x8', 2);

  const str = 'Duel';
  const strWidth = g.stringWidth(str);

  const x = g.getWidth() / 2 - strWidth / 2;
  const y = 30;

  g.setBgColor(clearColor);
  g.clearRect(x, y, x + strWidth, y + 24);
  
  g.setColor(textColor);
  g.drawString(str, x, y);
  g.setRotation(1);
  g.drawString(str, x, y);
  g.setRotation(2);
  g.drawString(str, x, y);
  g.setRotation(3);
  g.drawString(str, x, y);
  g.setRotation(0);
}

function drawTime() {
  if (!Bangle.isLCDOn()) {
    return;
  }

  const now = new Date();
  const clockHours = ((now.getHours() % 12) * 60) + now.getMinutes();
  const clockMinutes = now.getMinutes() + now.getSeconds() / 60;

  const hourAngle = clockHours * hourRevolutions;
  const minuteAngle = clockMinutes / minuteRevolutions;

  const hourRads = hourAngle * Math.PI / 180;
  const minuteRads = minuteAngle * Math.PI / 180;

  const x = g.getWidth() / 2;
  const y = g.getHeight() / 2;

  g.setBgColor(clearColor);
  g.clearRect(x - 38, y - 38, x + 38, y + 38);

  g.setColor(hourHandColor);
  g.drawLine(x, y, x - Math.cos(hourRads)*hourHandLength, y - Math.sin(hourRads)*hourHandLength);

  g.setColor(minuteHandColor);
  g.drawLine(x, y, x - Math.cos(minuteRads)*minuteHandLength, y - Math.sin(minuteRads)*minuteHandLength);
}

function drawClock() {
  if (!Bangle.isLCDOn()) {
    return;
  }

  drawBackground();
  drawFace();
  drawTime();
}

Bangle.setOptions({
  wakeOnTouch: true,
});

g.setBgColor(clearColor);
g.clear();

Bangle.loadWidgets();
Bangle.drawWidgets();

drawClock();

Bangle.setUI("clockupdown", btn => {
  drawClock();
});

const tick = setInterval(drawTime, 1000);
