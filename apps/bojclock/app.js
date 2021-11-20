const s = require('Storage');
const apps = s
  .list(/\.info$/)
  .map(app => {
    var a = s.readJSON(app, 1);
    return a && 
      {
        name: a.name,
        type: a.type,
        icon: a.icon,
        sortorder: a.sortorder,
        src: a.src
      };
    })
  .filter(app => app && (app.type === 'launch'));

apps.sort((a, b) => {
  var n = (0 || a.sortorder) - (0 || b.sortorder);
  if (n) {
    return n; // do sortorder first
  }
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});

// console.log(apps);
// console.log(Bangle.getOptions());

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

    if (sy < 80 && dy > 24) {
      changeInfoMode();
    }
  }
});

g.clear();

Bangle.loadWidgets();
Bangle.drawWidgets();

Bangle.setUI("clockupdown", btn => {
  if (btn < 0) {
    changeInfoMode();
  }
});
