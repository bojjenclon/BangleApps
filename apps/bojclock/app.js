const locale = require("locale");
const bg = {
  width : 176, height : 176, bpp : 8,
  transparent : 254,
  buffer : require("heatshrink").decompress(atob("AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4Ak6gAlM34A/V/4A/VP61/AH6v/V/4A/Vf6z/V/6v/AH4A/AH4A/AH4A/AH4AM5AA9P36v/V/4A/Vn6v/AH6v/WX6t/AH6v/V/6x/AH6v/V/4A/AH4A/AH4A/AH4Aq4QA/ABJ8xgQAxUn6v8gYAxUn4AKf4gAsV/4A9PuSv/V/4Auh4AvUX6x+V/4A/P+Cv/V/4A/V/6v/AH6v/AD0VAH4A/AH4A/AH4A/AH+2AH4ANR36v/V/4A/V/6v/AH6v/AB8hAH4AfUH6v/V/6v/AH6v/V/4A/V/6v/AH6g/V/6v/V/4A/V/6v/AH6v/V/4AO3IA/AH4A/AH4A/AEEAACYWSFKYTQCGRZmCoyv/CH6vvVqhBoV/6FaTS6vnCIKv/e1SvuKfKv/WGqv/EVqv/H1Kv/TTqwoTSgBCV/74rV9Q8pV/6aeWEyv/V/4peAH4A/AH4A/AH4AdgAAPCSQVXCiIR1OrAWBCqiv/CP6vaWEA4rTuxLTV/4VPAISv/fd6wkG1id2V/6v/V/6YcWDo1tV/6v/DrAVBV/78zWEIztTkiv/V/6v/V+CwaGVyv/V/4ZYCwKv/WH4MLAH4A/AH4A/AH4AdgAAJBhgALDCwWSCXB+bF94XBV/7/4V+pepV/6BqFtqv/V/6v/V/6BdDSQssV7LC3HgqDYV9YZXREwTnQbgaQFVSv/V/6v/V/6EkDZwppTf6v/FMAaXV/6wwbGib/V/QbKV/4T/Q9wmbV/6v/DibWmTf4ULNt4bIAoIA/AH4A/AH4A/ADsAgADDADIdXC6gUTFFAXbDpYjcDjCv/N94cIaUav/V/4dLV/6v/V9wgdV/7EsV8IeCaECv/V9qweZzyv/CjSR3V/4U/V/5W8V/6v/HjKEqV9qw8V/6v/V/6v/V/6v/V/6v/HVKv/LV6v/V/6v/V/6vvCoKv2DoIA/AH4A/AH4A/ADsAADIcaDSoV/DUIAcV/6v/ACgA=="))
};

const textColor = g.theme.dark ? '#0f0' : '#080';

function drawBackground() {
  g.drawImage(bg.buffer, 0, g.getHeight() - bg.height);
}

function drawTime() {
  if (!Bangle.isLCDOn()) {
    return;
  }

  const now = new Date();
  const time = locale.time(now, 1);

  const y = 40;

  g.setFont('6x8', 4);
  g.setColor(textColor);
  g.clearRect(0, y, ((time.length + 1) * 40), y + 40 - 1);
  g.drawString(time, 25, y);
}

function drawClock() {
  drawBackground();
  drawTime();
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

drawClock();

Bangle.on('lcdPower', on => {
  if (on) {
    drawClock();
  }
});

const tick = setInterval(drawTime, 1000);

Bangle.setUI("clockupdown", btn => {
  if (btn < 0) {
    // changeInfoMode();
  }

  drawClock();
});
