module.exports = {
  init() {
    $(() => {
        $('#editor').prop('disabled', true)
        $('#title').prop('disabled', true)
        $('#delete').prop('disabled', true)
        $('#save').prop('disabled', true)
        $('#editor').bind('input click', () => { // reload
            const editor = require('./editor.js')
            editor.reload()
        })
        const dbservice = require('./db.js')
        const db = new dbservice()
        db.get_notes(null, 'id,title', (res) => {db.update_note_list(res)})
    })
  }
}
