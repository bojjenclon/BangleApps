const locale = require("locale");
const storage = require('Storage');
const settings = (storage.readJSON('setting.json', 1) || {});
const is12Hour = settings["12hour"] || false;

const bg = {
  width : 176, height : 176, bpp : 8,
  buffer : require("heatshrink").decompress(atob("AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4Ak6gAlM34A/V/4A/VP61/AH6v/V/4A/Vf6z/V/6v/AH4A/AH4A/AH4A/AH4AM5AA9P36v/V/4A/Vn6v/AH6v/WX6t/AH6v/V/6x/AH6v/V/4A/AH4A/AH4A/AH4Aq4QA/ABJ8xgQAxUn6v8gYAxUn4AKf4gAsV/4A9PuSv/V/4Auh4AvUX6x+V/4A/P+Cv/V/4A/V/6v/AH6v/AD0VAH4A/AH4A/AH4A/AH+2AH4ANR36v/V/4A/V/6v/AH6v/AB8hAH4AfUH6v/V/6v/AH6v/V/4A/V/6v/AH6g/V/6v/V/4A/V/6v/AH6v/V/4AO3IA/AH4A/AH4A/AEEAACYWSFKYTQCGRZmCoyv/CH6vvVqhBoV/6FaTS6vnCIKv/e1SvuKfKv/WGqv/EVqv/H1Kv/TTqwoTSgBCV/74rV9Q8pV/6aeWEyv/V/4peAH4A/AH4A/AH4AdgAAPCSQVXCiIR1OrAWBCqiv/CP6vaWEA4rTuxLTV/4VPAISv/fd6wkG1id2V/6v/V/6YcWDo1tV/6v/DrAVBV/78zWEIztTkiv/V/6v/V+CwaGVyv/V/4ZYCwKv/WH4MLAH4A/AH4A/AH4AdgAAJBhgALDCwWSCXB+bF94XBV/7/4V+pepV/6BqFtqv/V/6v/V/6BdDSQssV7LC3HgqDYV9YZXREwTnQbgaQFVSv/V/6v/V/6EkDZwppTf6v/FMAaXV/6wwbGib/V/QbKV/4T/Q9wmbV/6v/DibWmTf4ULNt4bIAoIA/AH4A/AH4A/ADsAgADDADIdXC6gUTFFAXbDpYjcDjCv/N94cIaUav/V/4dLV/6v/V9wgdV/7EsV8IeCaECv/V9qweZzyv/CjSR3V/4U/V/5W8V/6v/HjKEqV9qw8V/6v/V/6v/V/6v/V/6v/HVKv/LV6v/V/6v/V/6vvCoKv2DoIA/AH4A/AH4A/ADsAADIcaDSoV/DUIAcV/6v/ACgA=="))
};

const textColor = g.theme.dark ? '#a0a' : '#080';

let tick;

function calcNextTick() {
  const secondsLeft = 60000 - (Date.now() % 60000);

  if (tick) {
    clearTimeout(tick);
  }

  tick = setTimeout(() => {
    tick = undefined;
    drawClock();
  }, secondsLeft);
}

function drawBackground() {
  g.drawImage(bg, 0, g.getHeight() - bg.height);
}

function drawTime() {
  const now = new Date();
  const hours = now.getHours();
  const clockHours = ('0' + ((is12Hour && hours > 12) ? hours - 12 : hours)).substr(-2);
  const clockMinutes = ('0' + now.getMinutes()).substr(-2);

  const time = `${clockHours}:${clockMinutes}`;

  const x = 46;
  const y = 34;
  const fontSize = 32;

  g.reset();

  g.setFont('Vector', fontSize);
  g.setColor(textColor);
  g.setBgColor('#000');
  g.clearRect(x, y, x + ((time.length + 2) * fontSize) - fontSize, y + fontSize);
  g.drawString(time, x, y);
}

function drawClock() {
  g.reset();

  drawBackground();
  drawTime();

  Bangle.drawWidgets();

  calcNextTick();
}

let didTouch = false;
let touchTimeout;

Bangle.on('touch', (zone, e) => {
  if (!Bangle.isLCDOn()) {
    return;
  }

  if (zone === 2) {
    if (didTouch) {
      Bangle.setLCDBrightness(1);
    }

    didTouch = true;

    if (touchTimeout) {
      clearTimeout(touchTimeout);
    }

    touchTimeout = setTimeout(() => {
      didTouch = false;
    }, 250);
  }
});


g.reset().clear();

Bangle.loadWidgets();
Bangle.drawWidgets();

drawClock();

Bangle.on('lcdPower', on => {
  if (on) {
    drawClock();
  } else {
    if (tick) {
      clearTimeout(tick);
      tick = undefined;
    }
  }
});

Bangle.setUI('clock');
