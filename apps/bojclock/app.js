const locale = require("locale");

function drawTime() {
  if (!Bangle.isLCDOn()) {
    return;
  }

  const now = new Date();
  writeLine(locale.time(now, 1), 0);
}

let dragStart = null;

Bangle.on('drag', e => {
  const b = e.b;

  if (b === 1 && !dragStart) {
    dragStart = e;
  } else if (b === 0 && dragStart) {
    const sy = dragStart.y;
    const ey = e.y;
    const dy = sy - ey;

    dragStart = null;

    if (sy < 88 && dy > 14) {
      Bangle.showLauncher();
    }
  }
});

g.clear();

Bangle.loadWidgets();
Bangle.drawWidgets();

drawTime();

Bangle.on('lcdPower', on => {
  if (on) {
    drawTime();
  }
});

const tick = setInterval(drawTime, 1000);

Bangle.setUI("clockupdown", btn => {
  if (btn < 0) {
    // changeInfoMode();
  }
});
