const main = require('./js/main.js')
const gui = require('nw.gui')
const win = gui.Window.get()
win.showDevTools()

console.log("enter init menu");
var menu = new nw.Menu();
// Add some items
menu.append(new nw.MenuItem({ label: 'Item A' }));
menu.append(new nw.MenuItem({ label: 'Item B' }));
menu.append(new nw.MenuItem({ type: 'separator' }));
menu.append(new nw.MenuItem({ label: 'Item C' }));

// Remove one item
menu.removeAt(1);

// Popup as context menu
menu.popup(10, 10);

// Iterate menu's items
for (var i = 0; i < menu.items.length; ++i) {
  console.log(menu.items[i]);
}

main.init()
