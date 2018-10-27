module.exports = {
  openFile() {
    editor.chooseFile('#openFile', filename => {
      editor.loadFile(filename)
    })
  },
  initMenu() {
    const win = global.gui.Window.get()
    const menubar = new global.gui.Menu({ type: 'menubar' })
    const fileMenu = new global.gui.Menu()
    // for Mac
    menubar.createMacBuiltin('LittleMD')
    fileMenu.append(new global.gui.MenuItem({
      label: 'Open...',
      click: this.openFile,
      modifiers: 'cmd',
      key: 'o',
    }))
    ... // other code
    menubar.append(new global.gui.MenuItem({
      label: 'File',
      submenu: fileMenu,
    }))
    win.menu = menubar
  },
}