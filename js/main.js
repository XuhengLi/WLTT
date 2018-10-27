const editor = require('./editor.js')
module.exports = {
  init() {
    $(() => {
      $('#editor').bind('input click', () => { // reload
        editor.reload()
      })
    })
  },
}