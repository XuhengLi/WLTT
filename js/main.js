const editor = require('./editor.js')
const menu = require('./menu.js')
menu.initMenu()
module.exports = {
  init() {
    $(() => {
      $('#editor').bind('input click', () => { // reload
        editor.reload()
      })
    })
  },
}