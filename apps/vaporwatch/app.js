const locale = require("locale");
const storage = require('Storage');
const settings = (storage.readJSON('setting.json', 1) || {});
const is12Hour = settings["12hour"] || false;

const bg = {
  width : 176, height : 128, bpp : 8,
  buffer : require("heatshrink").decompress(atob("AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AEnUAEpm/AH6v/AH6p/Wv4A/Vf6z/AH6v/V/4A/AH4A/AFnIAHp+/V/6v/AH6s/WX4A/Vv6v/V/4A/WP4A/AH4A/AH4A/AH4AK4QA/ABJ8xgQAxUn6v8gYAxUn4AKf4gAsVv4A/P18PAF6g/V/6v/AHx/wV/6v/AH4A/AA0VAH4A/AA+2AH4ANR36v/V/4A/V/6v/AH6v/AB8hAH4AfUH6v/V/6v/AH6v/V/4A/V/6v/AH4A/AH25AH4A/AH4A/AH4AggAATCyQpTCaAQyLMwVaINKv/QrSaXV84SBV/72qV9xT5V/6w0H1CvzJCaaVWFCaVV/74tV9Q8pV/6aeFKoA/AH4A/AH4A/ADsAAB4SSCq4URCOp1YCy442TuxLTV/4VQV/77xWEg2sTuyvrWDw1tV/6v/V36v7WGiv/V/6wuGVyv/PmgNBAH4A/AH4A/AH4AdgAAIBZYAMEpgXMCX4WkDC4uuCyiv/QNQttV/6v/FjSvsNfYWBWFTcsRFYTnQbgaQFVSv/V/4peLlav/QtDZpTf5TwDZDY0Tf6v6DZImbV/6v/Dh4FBAH4A/AH4A/AH4AdgEAAYYAZDq4XUCiYooC7YdKV2qv/K1gdMV/6v/V9wgdV/7EsV8IefD7Sv9CgKR2V/4U/V94AeK1yv/V/48ZQlSvtWHiv/V/6u/V/5a5V/6v/V/AdBAH4A/AH4A/AH4AdgAAZDjQaVCv4ahADiv/V/4AUA"))
};

const textColor = g.theme.dark ? '#a0a' : '#080';

const widgetHeight = 24;

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
  g.drawImage(bg, 0, widgetHeight);
}

function drawTime() {
  const now = new Date();
  const time = locale.time(now, 1);

  const x = Math.round(g.getWidth() / 2) + 2;
  const y = widgetHeight + 46;
  const fontSize = 32;

  g.reset();

  g.setFont('Vector', fontSize);
  g.setFontAlign(0, 1);
  g.setColor(textColor);
  g.setBgColor('#000');
  g.clearRect(x, y, x + ((time.length + 2) * fontSize) - fontSize, y - fontSize);
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
